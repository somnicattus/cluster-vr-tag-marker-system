interface StateProxy {
  // tag-controller
  personalTagBoards?: Record<string, ItemHandle>;

  // personal-tag-board
  owner?: PlayerHandle;
  controller?: ItemHandle;
  enabledTags?: {
    [tagGroupId: number]: number[];
  };
  offsetY?: number | null;
}
