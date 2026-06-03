import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RideCard } from "@/components/ride-card";
import { ridesApi } from "@/lib/rides-api";
import type { Ride } from "@/types/ride";

vi.mock("@/lib/rides-api", () => ({
  ridesApi: {
    requestJoin: vi.fn(),
    updateRequest: vi.fn(),
    complete: vi.fn(),
    cancel: vi.fn(),
    leave: vi.fn(),
  },
}));

const mocked = ridesApi as unknown as Record<string, ReturnType<typeof vi.fn>>;

function makeRide(overrides: Partial<Ride> = {}): Ride {
  return {
    id: "ride-1",
    driver_id: "driver-1",
    driver: {
      id: "driver-1", email: "d@post.bgu.ac.il", full_name: "דנה נהגת",
      onboarded: true, rating_avg: 4.5, rating_count: 3, created_at: "",
    },
    origin_address: "באר שבע",
    destination_address: "תל אביב",
    departure_time: new Date(Date.now() + 86400000).toISOString(),
    available_seats: 3,
    confirmed_passengers: 0,
    seats_left: 3,
    price_per_seat: 20,
    visibility: "city_wide",
    status: "active",
    created_at: "",
    ...overrides,
  };
}

describe("RideCard", () => {
  beforeEach(() => {
    Object.values(mocked).forEach((fn) => fn.mockResolvedValue({}));
  });

  it("shows route and seats for a passenger", () => {
    render(<RideCard ride={makeRide()} />);
    expect(screen.getByText("באר שבע")).toBeInTheDocument();
    expect(screen.getByText("תל אביב")).toBeInTheDocument();
    expect(screen.getByText(/3 מקומות פנויים/)).toBeInTheDocument();
  });

  it("passenger can send a join request", async () => {
    const onRequestSent = vi.fn();
    render(<RideCard ride={makeRide()} onRequestSent={onRequestSent} />);
    await userEvent.click(screen.getByText("בקש להצטרף"));
    await userEvent.click(screen.getByText("שלח בקשה"));
    await waitFor(() => expect(mocked.requestJoin).toHaveBeenCalledWith("ride-1", expect.any(Object)));
    expect(onRequestSent).toHaveBeenCalled();
  });

  it("shows pending status instead of join button", () => {
    render(<RideCard ride={makeRide()} myRequestStatus="pending" />);
    expect(screen.getByText(/ממתינה לאישור/)).toBeInTheDocument();
    expect(screen.queryByText("בקש להצטרף")).not.toBeInTheDocument();
  });

  it("driver sees pending requests and can accept", async () => {
    const ride = makeRide({
      requests: [{
        id: "req-1", passenger_id: "p1",
        passenger: { id: "p1", email: "p@x.com", full_name: "פנינה נוסעת", onboarded: true, rating_avg: 0, rating_count: 0, created_at: "" },
        requested_seats: 1, status: "pending", created_at: "",
      }],
    });
    const onRequestUpdate = vi.fn();
    render(<RideCard ride={ride} isDriver onRequestUpdate={onRequestUpdate} />);
    expect(screen.getByText(/פנינה נוסעת/)).toBeInTheDocument();
    await userEvent.click(screen.getByText("✓ אשר"));
    await waitFor(() => expect(mocked.updateRequest).toHaveBeenCalledWith("ride-1", "req-1", "accepted"));
    expect(onRequestUpdate).toHaveBeenCalled();
  });

  it("driver can complete a ride", async () => {
    const onLifecycle = vi.fn();
    render(<RideCard ride={makeRide()} isDriver onLifecycle={onLifecycle} />);
    await userEvent.click(screen.getByText("✓ סמן כהושלמה"));
    await waitFor(() => expect(mocked.complete).toHaveBeenCalledWith("ride-1"));
    expect(onLifecycle).toHaveBeenCalled();
  });

  it("joined passenger can leave a ride", async () => {
    const onLifecycle = vi.fn();
    render(<RideCard ride={makeRide()} joined myRequestStatus="accepted" onLifecycle={onLifecycle} />);
    await userEvent.click(screen.getByText("עזוב נסיעה"));
    await waitFor(() => expect(mocked.leave).toHaveBeenCalledWith("ride-1"));
  });
});
