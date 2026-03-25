from ortools.sat.python import cp_model
from datetime import datetime, timedelta


# 🔹 Helper: Calculate duration (handles midnight)
def calculate_duration(start, end):
    start_dt = datetime.combine(datetime.today(), start)
    end_dt = datetime.combine(datetime.today(), end)

    if end_dt <= start_dt:
        end_dt += timedelta(days=1)

    return int((end_dt - start_dt).seconds // 3600)


# 🔹 Convert shift to datetime (for rest constraint)
def get_shift_datetimes(shift):
    start = datetime.combine(shift["date"], shift["start_time"])
    end = datetime.combine(shift["date"], shift["end_time"])

    if end <= start:
        end += timedelta(days=1)

    return start, end


def generate_schedule(employees, shifts, availability):

    if not employees:
        raise ValueError("No employees available")

    model = cp_model.CpModel()

    num_employees = len(employees)
    num_shifts = len(shifts)

    # 🔹 Decision variables
    x = {}
    for e in range(num_employees):
        for s in range(num_shifts):
            x[(e, s)] = model.NewBoolVar(f"x_{e}_{s}")

    # 🔥 AVAILABILITY + WARD CONSTRAINT (FIXED)
    for e in range(num_employees):
        emp_id = employees[e]["id"]

        for s in range(num_shifts):
            shift = shifts[s]

            valid = False

            for a in availability:
                if (
                    a["employee_id"] == emp_id and
                    a["date"] == shift["date"] and
                    a["start_time"] == shift["start_time"] and
                    a["end_time"] == shift["end_time"] and
                    a["ward_id"] == shift["ward_id"]   # ✅ CRITICAL FIX
                ):
                    valid = True
                    break

            if not valid:
                model.Add(x[(e, s)] == 0)

    # 🔥 GENDER CONSTRAINT (NEW)
    for e in range(num_employees):
        emp_gender = employees[e]["gender"]

        for s in range(num_shifts):
            ward_id = shifts[s]["ward_id"]

            # Female wards → only Female staff
            if ward_id in [1, 4] and emp_gender != "Female":
                model.Add(x[(e, s)] == 0)

            # Male wards → only Male staff
            if ward_id in [2, 3, 5] and emp_gender != "Male":
                model.Add(x[(e, s)] == 0)

    # 🔥 REST TIME CONSTRAINT
    MIN_REST_HOURS = 8

    for e in range(num_employees):
        for s1 in range(num_shifts):
            for s2 in range(num_shifts):

                if s1 >= s2:
                    continue

                start1, end1 = get_shift_datetimes(shifts[s1])
                start2, end2 = get_shift_datetimes(shifts[s2])

                gap1 = (start2 - end1).total_seconds() / 3600
                gap2 = (start1 - end2).total_seconds() / 3600

                if gap1 < MIN_REST_HOURS and gap2 < MIN_REST_HOURS:
                    model.Add(x[(e, s1)] + x[(e, s2)] <= 1)

    # 🔹 One employee per shift (max)
    for s in range(num_shifts):
        model.Add(
            sum(x[(e, s)] for e in range(num_employees)) <= 1
        )

    # 🔹 Durations
    durations = [
        calculate_duration(s["start_time"], s["end_time"])
        for s in shifts
    ]

    # 🔹 Max hours per employee
    for e in range(num_employees):
        model.Add(
            sum(
                x[(e, s)] * durations[s]
                for s in range(num_shifts)
            ) <= int(employees[e]["max_hours"])
        )

    # 🔹 Limit shifts per employee
    max_shifts_per_employee = num_shifts // num_employees + 1

    for e in range(num_employees):
        model.Add(
            sum(x[(e, s)] for s in range(num_shifts))
            <= max_shifts_per_employee
        )

    # 🔥 OBJECTIVE → maximize coverage
    model.Maximize(
        sum(x[(e, s)] for e in range(num_employees) for s in range(num_shifts))
    )

    # 🔹 Solve
    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    assignments = []

    if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        for e in range(num_employees):
            for s in range(num_shifts):
                if solver.Value(x[(e, s)]) == 1:
                    assignments.append(
                        (employees[e]["id"], shifts[s]["id"])
                    )

    return assignments