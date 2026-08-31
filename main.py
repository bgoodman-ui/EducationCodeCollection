import tkinter as tk
from functools import partial

root = tk.Tk()
root.geometry("500x500")
root.title("Education App Test")

topic_tree =  {
    "id": "home",
    "title": "Home",
    "children": [
        {
            "id": "math",
            "title": "Math",
            "children": [
                {"id": "addition", "title": "Addition", "children": [
                    {"id":"addition", "title": "lesson1","children":[]},
                    {"id":"addition", "title": "lesson2","children":[]},
                ]},
                {"id": "subtraction", "title": "Subtraction", "children": []},
            ],
        },
        {
            "id": "csci",
            "title": "CSCI",
            "children": [
                {"id": "basics", "title": "Basics", "children": []},
                {"id": "loops", "title": "Loops", "children": []},
                {"id": "variables", "title": "Variables", "children": []},
            ],
        },
    ],
}

# navigation between pages
history = []
current_frame = None
current_builder = None


def navigate_to(build_func):
    global current_frame, current_builder
    if current_builder is not None:
        history.append(current_builder)
    if current_frame is not None:
        current_frame.destroy()
    current_builder = build_func
    current_frame = build_func()
    current_frame.pack(fill="both", expand=True)


def go_back():
    global current_frame, current_builder
    if not history:
        return
    current_frame.destroy()
    current_builder = history.pop()
    current_frame = current_builder()
    current_frame.pack(fill="both", expand=True)


# ---- 3. Layout constants ----
# Kept in one place so every page stays visually consistent.
BUTTON_WIDTH = 14  # characters
BUTTON_HEIGHT = 5  # text lines
GRID_COLUMNS = 2
FONT_LABEL = ("Arial", 12)
FONT_TITLE = ("Arial", 16, "bold")
FONT_BACK = ("Arial", 10)


# ---- 4. Generic page builder ----
def make_page(node):
    frame = tk.Frame(root)

    # --- Top bar: back button (fixed top-left) + title (centered) ---
    top_bar = tk.Frame(frame)
    top_bar.grid(row=0, column=0, columnspan=GRID_COLUMNS, sticky="ew", pady=(10, 20))
    top_bar.grid_columnconfigure(0, weight=1)
    top_bar.grid_columnconfigure(1, weight=2)
    top_bar.grid_columnconfigure(2, weight=1)

    if node["id"] != "home":
        back_btn = tk.Button(
            top_bar, text="< Back", font=FONT_BACK, command=go_back
        )
        back_btn.grid(row=0, column=0, sticky="w", padx=10)

    title_label = tk.Label(top_bar, text=node["title"], font=FONT_TITLE)
    title_label.grid(row=0, column=1)

    # --- Content: grid of child topics, or a placeholder leaf message ---
    content = tk.Frame(frame)
    content.grid(row=1, column=0, columnspan=GRID_COLUMNS)

    if node["children"]:
        for i, child in enumerate(node["children"]):
            row = i // GRID_COLUMNS
            col = i % GRID_COLUMNS
            btn = tk.Button(
                content,
                text=child["title"],
                width=BUTTON_WIDTH,
                height=BUTTON_HEIGHT,
                font=FONT_LABEL,
                command=partial(navigate_to, partial(make_page, child)),
            )
            btn.grid(row=row, column=col, padx=12, pady=12)
    else:
        tk.Label(
            content,
            text=f"(Activity content for '{node['title']}' goes here)",
            font=FONT_LABEL,
            wraplength=350,
        ).grid(row=0, column=0, columnspan=GRID_COLUMNS, pady=20)

    return frame


navigate_to(partial(make_page, topic_tree))
root.mainloop()

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
