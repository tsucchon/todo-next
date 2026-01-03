import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../page";

describe("Home (TODOリスト)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("初期レンダリング", () => {
    it("タイトルが表示される", () => {
      render(<Home />);
      expect(screen.getByText("TODOリスト")).toBeInTheDocument();
    });

    it("入力フィールドとボタンが表示される", () => {
      render(<Home />);
      expect(
        screen.getByPlaceholderText("新しいタスクを入力...")
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "追加" })).toBeInTheDocument();
    });

    it("初期状態ではタスクがないメッセージが表示される", () => {
      render(<Home />);
      expect(
        screen.getByText("タスクがありません。新しいタスクを追加してください。")
      ).toBeInTheDocument();
    });

    it("初期状態では統計が表示されない", () => {
      render(<Home />);
      expect(screen.queryByText(/合計:/)).not.toBeInTheDocument();
    });
  });

  describe("TODOの追加", () => {
    it("入力してボタンをクリックするとTODOが追加される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const button = screen.getByRole("button", { name: "追加" });

      await user.type(input, "テストタスク");
      await user.click(button);

      expect(screen.getByText("テストタスク")).toBeInTheDocument();
    });

    it("TODOを追加すると入力フィールドがクリアされる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText(
        "新しいタスクを入力..."
      ) as HTMLInputElement;
      const button = screen.getByRole("button", { name: "追加" });

      await user.type(input, "テストタスク");
      await user.click(button);

      expect(input.value).toBe("");
    });

    it("Enterキーを押してもTODOが追加される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");

      await user.type(input, "Enterで追加{Enter}");

      expect(screen.getByText("Enterで追加")).toBeInTheDocument();
    });

    it("空白のみの入力では追加されない", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const button = screen.getByRole("button", { name: "追加" });

      await user.type(input, "   ");
      await user.click(button);

      expect(
        screen.getByText("タスクがありません。新しいタスクを追加してください。")
      ).toBeInTheDocument();
    });

    it("複数のTODOを追加できる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const button = screen.getByRole("button", { name: "追加" });

      await user.type(input, "タスク1");
      await user.click(button);

      await user.type(input, "タスク2");
      await user.click(button);

      expect(screen.getByText("タスク1")).toBeInTheDocument();
      expect(screen.getByText("タスク2")).toBeInTheDocument();
    });
  });

  describe("TODOの削除", () => {
    it("削除ボタンをクリックするとTODOが削除される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "削除されるタスク");
      await user.click(addButton);

      const deleteButton = screen.getByRole("button", { name: "削除" });
      await user.click(deleteButton);

      expect(screen.queryByText("削除されるタスク")).not.toBeInTheDocument();
    });

    it("複数のTODOから特定のTODOのみを削除できる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "タスク1");
      await user.click(addButton);

      await user.type(input, "タスク2");
      await user.click(addButton);

      const deleteButtons = screen.getAllByRole("button", { name: "削除" });
      await user.click(deleteButtons[0]);

      expect(screen.queryByText("タスク1")).not.toBeInTheDocument();
      expect(screen.getByText("タスク2")).toBeInTheDocument();
    });
  });

  describe("TODOの完了/未完了の切り替え", () => {
    it("チェックボックスをクリックするとTODOが完了状態になる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "完了するタスク");
      await user.click(addButton);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);

      expect(checkbox).toBeChecked();
    });

    it("完了状態のTODOは取り消し線が表示される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "完了するタスク");
      await user.click(addButton);

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);

      const taskText = screen.getByText("完了するタスク");
      expect(taskText).toHaveClass("line-through");
    });

    it("完了状態を切り替えられる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "トグルするタスク");
      await user.click(addButton);

      const checkbox = screen.getByRole("checkbox");

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe("統計の表示", () => {
    it("TODOがある場合は統計が表示される", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "タスク1");
      await user.click(addButton);

      expect(screen.getByText("合計: 1個")).toBeInTheDocument();
      expect(screen.getByText("完了: 0個")).toBeInTheDocument();
      expect(screen.getByText("未完了: 1個")).toBeInTheDocument();
    });

    it("完了数が正しくカウントされる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "タスク1");
      await user.click(addButton);

      await user.type(input, "タスク2");
      await user.click(addButton);

      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[0]);

      expect(screen.getByText("合計: 2個")).toBeInTheDocument();
      expect(screen.getByText("完了: 1個")).toBeInTheDocument();
      expect(screen.getByText("未完了: 1個")).toBeInTheDocument();
    });

    it("全てのTODOを削除すると統計が非表示になる", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      await user.type(input, "タスク1");
      await user.click(addButton);

      expect(screen.getByText("合計: 1個")).toBeInTheDocument();

      const deleteButton = screen.getByRole("button", { name: "削除" });
      await user.click(deleteButton);

      expect(screen.queryByText(/合計:/)).not.toBeInTheDocument();
    });
  });

  describe("統合テスト", () => {
    it("複数の操作を組み合わせた完全なワークフロー", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByRole("button", { name: "追加" });

      // 3つのタスクを追加
      await user.type(input, "タスク1");
      await user.click(addButton);

      await user.type(input, "タスク2");
      await user.click(addButton);

      await user.type(input, "タスク3");
      await user.click(addButton);

      // 統計を確認
      expect(screen.getByText("合計: 3個")).toBeInTheDocument();
      expect(screen.getByText("未完了: 3個")).toBeInTheDocument();

      // 1つ目を完了
      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[0]);

      expect(screen.getByText("完了: 1個")).toBeInTheDocument();
      expect(screen.getByText("未完了: 2個")).toBeInTheDocument();

      // 2つ目を削除
      const deleteButtons = screen.getAllByRole("button", { name: "削除" });
      await user.click(deleteButtons[1]);

      expect(screen.queryByText("タスク2")).not.toBeInTheDocument();
      expect(screen.getByText("合計: 2個")).toBeInTheDocument();

      // 残りのタスクが表示されていることを確認
      expect(screen.getByText("タスク1")).toBeInTheDocument();
      expect(screen.getByText("タスク3")).toBeInTheDocument();
    });
  });
});
