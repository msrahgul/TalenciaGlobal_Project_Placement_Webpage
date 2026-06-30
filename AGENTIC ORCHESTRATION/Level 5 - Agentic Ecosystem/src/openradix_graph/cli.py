"""
cli.py
======
Entry point for the Level 5 ecosystem:

    python -m openradix_graph doctor
    python -m openradix_graph run --company "Blinkit"
    python -m openradix_graph run --company "Blinkit" --company-id 117 --max-retries 3

Run `doctor` first: it pings all three providers so a bad API key is caught in
seconds instead of mid-pipeline.

Heavy imports (graph/langgraph/pydantic) are deferred into the run path so
``--help`` works before the full stack is installed.
"""

import argparse


def _summary(state: dict) -> None:
    print("\n================ RUN SUMMARY ================")
    print(f"company        : {state.get('company')}")
    print(f"company_id     : {state.get('company_id')}")
    print(f"db status      : {state.get('db_status')}  error={state.get('db_error')}")
    failures = state.get("gate_failures", [])
    print(f"gate failures  : {len(failures)}")
    stage = state.get("stage_failures", [])
    print(f"stage failures : {len(stage)}")
    if stage:
        for s in stage:
            print(f"   - {s}")
    print("=============================================")


def _run(company: str, company_id, max_retries) -> None:
    from . import config
    if max_retries is not None:
        config.MAX_RETRIES = max_retries

    from .graph import build_graph
    graph = build_graph()
    initial = {
        "company": company,
        "company_id": company_id,
        "attempts": {},
        "valid": {},
        "raw": {},
        "rows": {},
    }
    final = graph.invoke(initial)
    _summary(final)


def main(argv=None) -> None:
    parser = argparse.ArgumentParser(
        prog="openradix_graph",
        description="OpenRADIX Level 5 - LangGraph agentic ecosystem (validate + persist with retry).",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    run_p = sub.add_parser("run", help="Run the full validated pipeline for one company.")
    run_p.add_argument("--company", required=True, help='Target company, e.g. "Blinkit".')
    run_p.add_argument("--company-id", type=int, default=None, help="Explicit company_id (else resolved/assigned).")
    run_p.add_argument("--max-retries", type=int, default=None, help="Override MAX_RETRIES for this run.")

    doctor_p = sub.add_parser(
        "doctor", help="Ping each provider to check its API key works (run this first)."
    )
    doctor_p.add_argument(
        "--providers", nargs="+", default=None,
        help="Providers to check (default: the configured research fan-out).",
    )

    args = parser.parse_args(argv)
    if args.command == "run":
        _run(args.company, args.company_id, args.max_retries)
    elif args.command == "doctor":
        from . import doctor
        if args.providers is None:
            raise SystemExit(doctor.run())
        raise SystemExit(doctor.run(tuple(args.providers)))
