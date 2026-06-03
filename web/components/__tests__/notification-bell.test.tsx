import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationBell } from "@/components/notification-bell";
import { notificationsApi } from "@/lib/notifications-api";

vi.mock("@/lib/notifications-api", () => ({
  notificationsApi: {
    unreadCount: vi.fn(),
    list: vi.fn(),
    markAllRead: vi.fn(),
  },
}));

const mocked = notificationsApi as unknown as {
  unreadCount: ReturnType<typeof vi.fn>;
  list: ReturnType<typeof vi.fn>;
  markAllRead: ReturnType<typeof vi.fn>;
};

describe("NotificationBell", () => {
  beforeEach(() => {
    mocked.unreadCount.mockResolvedValue({ count: 2 });
    mocked.list.mockResolvedValue([
      { id: "1", type: "request_received", title: "בקשה חדשה", body: "גוף", read: false, created_at: new Date().toISOString() },
      { id: "2", type: "request_accepted", title: "אושר", body: "גוף2", read: true, created_at: new Date().toISOString() },
    ]);
    mocked.markAllRead.mockResolvedValue({ marked: 1 });
  });

  it("shows the unread badge from the API", async () => {
    render(<NotificationBell />);
    await waitFor(() => expect(screen.getByTestId("notif-badge")).toHaveTextContent("2"));
  });

  it("opens the dropdown and lists notifications", async () => {
    render(<NotificationBell />);
    await waitFor(() => expect(mocked.unreadCount).toHaveBeenCalled());
    await userEvent.click(screen.getByLabelText("התראות"));
    await waitFor(() => expect(screen.getByText("בקשה חדשה")).toBeInTheDocument());
    expect(screen.getByText("אושר")).toBeInTheDocument();
  });

  it("mark-all-read clears the badge", async () => {
    render(<NotificationBell />);
    await userEvent.click(screen.getByLabelText("התראות"));
    await waitFor(() => expect(screen.getByText("סמן הכל כנקרא")).toBeInTheDocument());
    await userEvent.click(screen.getByText("סמן הכל כנקרא"));
    await waitFor(() => expect(screen.queryByTestId("notif-badge")).not.toBeInTheDocument());
  });
});
