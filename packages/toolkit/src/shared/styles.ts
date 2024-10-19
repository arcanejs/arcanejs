/**
 * Styling options for the [[Group]] component
 *
 * Default Styling: [[GROUP_DEFAULT_STYLE]]
 */
export type GroupComponentStyle = {
  /**
   * In which way should child components of this group be organized?
   */
  direction: 'horizontal' | 'vertical';
  /**
   * If true, when the group runs out of vertical or horizontal space, child
   * components will be wrapped, and start to be arranged on additional columns
   * or rows.
   */
  wrap?: boolean;
  /**
   * If true, this group will have a border and a different color background
   * to its parent.
   *
   * This allows you to add a distinctive border between components,
   * without needing to set a header, add header components,
   * or make it collapsible.
   */
  border?: true;
};

/**
 * Default [[GroupComponentStyle]] for the [[Group]] component.
 */
export const GROUP_DEFAULT_STYLE: GroupComponentStyle = {
  direction: 'horizontal',
};

/**
 * Styling options for the [[Label]] component
 *
 * Default Styling: [[LABEL_DEFAULT_STYLE]]
 */
export type LabelComponentStyle = {
  /**
   * If true, make the text of this label bold
   */
  bold?: boolean;
};
