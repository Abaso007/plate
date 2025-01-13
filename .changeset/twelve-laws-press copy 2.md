---
'@udecode/slate': patch
---

- Fix `editor.api.last(at, { level: 0 })` when editor has no children, it should return `undefined`. Fixes error on cmd+a > backspace.
- Fix `editor.tf.removeNodes` when `previousEmptyBlock` is true without `at` option, it should return early.
  - Fixes #3960
- Add `RangeApi.contains` to check if a range fully contains another range (both start and end points).
- Add `editor.api.isSelected(target, { contains?: boolean })` to check if a path or range is selected by the current selection. When `contains` is true, checks if selection fully contains the target.
- `editor.tf.insertText` now support both legacy slate transforms `editor.insertText` and `Transforms.insertText`:
  - `editor.insertText` -> `editor.tf.insertText` without `at` option. In addition, `marks: false` option can be used to exclude current marks. Default is `true`.
  - `Transforms.insertText` -> `editor.tf.insertText` with `at` option
- Add `editor.api.next` option `from`:
  - `from?: 'after' | 'child'` (default: `'after'`): Determines where to start traversing from
  - `'after'`: Start from the point after the current location
  - `'child'`: Start from the first child of the current path. `at` must be a path.
- Add `editor.api.previous` option `from`:
  - `from?: 'before' | 'parent'` (default: `'before'`): Determines where to start traversing from
  - `'before'`: Start from the point before the current location
  - `'parent'`: Start from the parent of the current path. `at` must be a path.