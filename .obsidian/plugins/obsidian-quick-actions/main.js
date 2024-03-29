/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");
var import_electron = require("electron");

// AddCodeBlockModal.ts
var import_obsidian = require("obsidian");
var AddCodeBlockModal = class extends import_obsidian.Modal {
  constructor(app, editor, code_lang = "") {
    super(app);
    __publicField(this, "code");
    __publicField(this, "need_format");
    __publicField(this, "onSubmit");
    __publicField(this, "editor");
    __publicField(this, "code_lang");
    this.editor = editor;
    this.code_lang = code_lang;
  }
  _create_code_block() {
    let block_tag = "```";
    return `${block_tag}${this.code_lang}
${this.code}
${block_tag}`;
  }
  _add_code_block() {
    let insert_line_id;
    if (this.editor.somethingSelected()) {
      let cursor = this.editor.getCursor("from");
      insert_line_id = cursor.ch == 0 ? cursor.line : cursor.line + 1;
      let end_cursor = this.editor.getCursor("to");
      let line = this.editor.getLine(end_cursor.line);
      if (line.length > end_cursor.ch) {
        this.editor.replaceSelection("\n\n");
      } else {
        this.editor.replaceSelection("\n");
      }
    } else {
      let cursor = this.editor.getCursor();
      let line = this.editor.getLine(cursor.line);
      insert_line_id = cursor.line;
      if (line) {
        insert_line_id++;
        this.editor.replaceRange("\n", { line: cursor.line, ch: line.length });
      }
    }
    this.editor.replaceRange(this._create_code_block(), { line: insert_line_id, ch: 0 });
  }
  onOpen() {
    const { contentEl } = this;
    new import_obsidian.Setting(contentEl).setName("Code Lang").addText((text) => {
      text.setPlaceholder(this.code_lang);
      text.onChange((value) => {
        this.code_lang = value;
      });
    });
    new import_obsidian.Setting(contentEl).setName("Code Text").addTextArea((text) => {
      text.setPlaceholder(this.editor.getSelection());
      this.code = this.editor.getSelection();
      text.onChange((value) => {
        this.code = value;
      });
    });
    new import_obsidian.Setting(contentEl).addButton((btn) => {
      btn.setButtonText("Confirm").setCta().onClick(() => {
        this._add_code_block();
        this.close();
      });
      // Binding the Enter key to trigger confirm action.
      this.app.workspace.on('keydown', (evt) => {
        if (evt.keyCode === 13) {
          btn.click()  // Set the effect same as the confirm click.
        }
      })
    }).addButton((btn) => {
      btn.setButtonText("Cancel").setCta().onClick(() => this.close());
    });
  }
  onClose() {
    this.contentEl.empty();
    this.editor = null;
  }
};

// main.ts
var DEFAULT_SETTINGS = {
  mySetting: "default",
  debugMode: true
};
var QuickPlugin = class extends import_obsidian2.Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "settings");
    __publicField(this, "editor");
  }
  _debug() {
    if (this.settings.debugMode) {
      console.log("Add property editor,view to window for debug, close that by set settings.debugMode=false.");
      const view = this.app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
      const editor = view.editor;
      Object.defineProperty(window, "editor", { value: editor });
    }
  }
  _log(...args) {
    if (this.settings.debugMode) {
      console.log(...args);
    }
  }
  _extract_headline_info(line) {
    var _a, _b;
    let headline_reg = /^(?<level>#+)\s(?<text>.*)$/;
    let res = (_a = line.match(headline_reg)) == null ? void 0 : _a.groups;
    let head_level = (_b = res == null ? void 0 : res.level) == null ? void 0 : _b.length;
    let text = res == null ? void 0 : res.text;
    return [head_level, text];
  }
  _make_new_headline(headline, level_up) {
    let level = headline[0];
    if (!level) {
      return "";
    }
    console.log(level_up);
    let new_level = level_up ? level - 1 : level + 1;
    console.log("level->new level:", level, "->", new_level);
    new_level = Math.clamp(new_level, 1, 6);
    if (new_level == level) {
      return "";
    }
    return "#".repeat(new_level) + " " + headline[1];
  }
  _set_single_headline_level(editor, level_up) {
    let cursor = editor.getCursor();
    let cur_line = editor.getLine(cursor.line);
    let headline = this._extract_headline_info(cur_line);
    if (!headline[0]) {
      this._log("There is no headline.");
      return;
    }
    let new_line = this._make_new_headline(headline, level_up);
    if (!new_line) {
      this._log("The level of headline can not be changed!");
      return;
    }
    this._log("Set new headline:", new_line);
    editor.setLine(cursor.line, new_line);
  }
  _set_selection_headline_level(editor, level_up) {
    let cursor_from = editor.getCursor("from");
    let cursor_to = editor.getCursor("to");
    let from_line = Math.min(cursor_from.line, cursor_to.line);
    let to_line = Math.max(cursor_from.line, cursor_to.line);
    let count = 0;
    for (let index = from_line; index < to_line + 1; index++) {
      let line = editor.getLine(index);
      let headline = this._extract_headline_info(line);
      if (headline[0]) {
        let new_line = this._make_new_headline(headline, level_up);
        if (new_line) {
          editor.setLine(index, new_line);
          count++;
        }
      }
    }
    this._log("Change healine level count:", count);
  }
  _add_same_level_headline(editor) {
    if (editor.somethingSelected()) {
      this._log("Can not add headline with something selected!");
      return;
    }
    let line_idx = editor.getCursor().line;
    let line = editor.getLine(line_idx);
    let up_idx = line_idx - 1;
    let prev_level = 1;
    while (up_idx >= 0) {
      let prev_line = editor.getLine(up_idx);
      let prev_h = this._extract_headline_info(prev_line);
      if (prev_h[0]) {
        prev_level = prev_h[0];
        break;
      }
      up_idx--;
    }
    if (line) {
      let headline = this._extract_headline_info(line);
      let new_line;
      if (headline[0]) {
        new_line = "#".repeat(prev_level) + " " + headline[1];
      } else {
        new_line = "#".repeat(prev_level) + " " + line;
      }
      editor.setLine(line_idx, new_line);
      this._log("Add new headline:", new_line);
    } else {
      let new_line = "#".repeat(prev_level) + " ";
      editor.setLine(line_idx, new_line);
      editor.setCursor(line_idx, new_line.length);
      this._log("Add new headline:", new_line);
    }
  }
  _swap_lines(editor, line1_id, line2_id) {
    let temp_line = editor.getLine(line1_id);
    editor.setLine(line1_id, editor.getLine(line2_id));
    editor.setLine(line2_id, temp_line);
  }
  _move_block(editor, move_up) {
    let from_line_id = editor.getCursor("from").line;
    let end_line_id = editor.getCursor("to").line;
    if (from_line_id == end_line_id) {
      this._move_single_line(editor, move_up);
      return;
    }
    if (from_line_id > end_line_id) {
      [from_line_id, end_line_id] = [end_line_id, from_line_id];
    }
    let move_to_line_id = move_up ? from_line_id - 1 : end_line_id + 1;
    if (move_to_line_id < 0) {
      this._log("Can not move up further!");
      return;
    }
    let temp_line = editor.getLine(move_to_line_id);
    let moved_block = editor.getRange({ line: from_line_id, ch: 0 }, { line: end_line_id, ch: null });
    let new_block;
    let new_from_line_id = from_line_id;
    let new_end_line_id = end_line_id;
    if (move_up) {
      new_block = moved_block + "\n" + temp_line;
      new_from_line_id = from_line_id - 1;
    } else {
      new_block = temp_line + "\n" + moved_block;
      new_end_line_id = end_line_id + 1;
    }
    editor.replaceRange(new_block, { line: new_from_line_id, ch: 0 }, { line: new_end_line_id, ch: null });
    editor.setSelection({ line: move_up ? from_line_id - 1 : from_line_id + 1, ch: 0 }, { line: move_up ? end_line_id - 1 : end_line_id + 1, ch: null });
    this._log("Block moved!");
  }
  _move_single_line(editor, move_up) {
    let cur_line_id = editor.getCursor().line;
    let move_to_line_id = move_up ? cur_line_id - 1 : cur_line_id + 1;
    if (move_to_line_id < 0) {
      this._log("Can not move up further!");
      return;
    }
    this._swap_lines(editor, cur_line_id, move_to_line_id);
    editor.setCursor(move_to_line_id);
    this._log("Origin cursor line:", cur_line_id);
    this._log("Move cursor line:", move_to_line_id);
    this._log("Line has been Moved!");
  }
  _past_code_block(editor) {
    let code_text = import_electron.clipboard.readText();
    let line_id = editor.getCursor().line;
    let line = editor.getLine(line_id);
    if (line) {
      new import_obsidian2.Notice("Please past code in an empty line!");
      return;
    }
    const code_lang = this._find_previous_code_language(editor);
    this._log("find code lang:", code_lang);
    const block_tag = "```";
    let code_block = `${block_tag}${code_lang}
${code_text}
${block_tag}`;
    if (editor.getLine(line_id + 1))
      code_block.concat("\n");
    editor.replaceRange(code_block, { line: line_id, ch: null });
    editor.setCursor({ line: line_id, ch: 3 });
  }
  _find_previous_code_language(editor) {
    let line_id = editor.getCursor().line;
    while (line_id >= 0) {
      let line = editor.getLine(line_id).trim();
      if (line.startsWith("```") && line.length < 15 && line.length > 3) {
        this._log("Find code line:", line_id, line);
        return line.slice(3);
      }
      line_id -= 1;
    }
    this._log("Can not code lang!");
    return "";
  }
  onload() {
    return __async(this, null, function* () {
      yield this.loadSettings();
      this._debug();
      this.addCommand({
        id: "level-up-headline",
        name: "Level up headline",
        hotkeys: [{ modifiers: ["Mod", "Alt"], key: "ArrowUp" }],
        editorCallback: (editor, view) => {
          if (editor.somethingSelected()) {
            this._set_selection_headline_level(editor, true);
          } else {
            this._set_single_headline_level(editor, true);
          }
        }
      });
      this.addCommand({
        id: "level-down-headline",
        name: "Level down headline",
        hotkeys: [{ modifiers: ["Mod", "Alt"], key: "ArrowDown" }],
        editorCallback: (editor, view) => {
          if (editor.somethingSelected()) {
            this._set_selection_headline_level(editor, false);
          } else {
            this._set_single_headline_level(editor, false);
          }
        }
      });
      this.addCommand({
        id: "add-same-level-healine",
        name: "Set headline with the same level of the previous.",
        hotkeys: [{ modifiers: ["Mod", "Alt"], key: "h" }],
        editorCallback: (editor, view) => {
          this._add_same_level_headline(editor);
        }
      });
      this.addCommand({
        id: "move-block-up",
        name: "Move block upward!",
        hotkeys: [{ modifiers: ["Alt"], key: "ArrowUp" }],
        editorCallback: (editor, view) => {
          if (editor.somethingSelected()) {
            this._move_block(editor, true);
          } else {
            this._move_single_line(editor, true);
          }
        }
      });
      this.addCommand({
        id: "move-block-down",
        name: "Move block downward!",
        hotkeys: [{ modifiers: ["Alt"], key: "ArrowDown" }],
        editorCallback: (editor, view) => {
          if (editor.somethingSelected()) {
            this._move_block(editor, false);
          } else {
            this._move_single_line(editor, false);
          }
        }
      });
      this.addCommand({
        id: "add-code-block",
        name: "Add code block",
        hotkeys: [{ modifiers: ["Mod", "Alt"], key: "`" }],
        editorCallback: (editor, view) => {
          new AddCodeBlockModal(this.app, editor, this._find_previous_code_language(editor)).open();
        }
      });
      this.registerEvent(this.app.workspace.on("editor-menu", (menu, editor, view) => {
        menu.addItem((item) => {
          item.setTitle("Past as code block");
          item.setIcon("copy").onClick(() => __async(this, null, function* () {
            this._past_code_block(editor);
          }));
        });
      }));
    });
  }
  onunload() {
    this.saveSettings();
  }
  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
};
var main_default = QuickPlugin;
