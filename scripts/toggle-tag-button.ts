const tagController = $.worldItemReference('tagController');

$.onInteract((player) => {
  $.log(`player "${player.userId}" interacted with tag button "${$.id}"`);

  const tagId = $.getStateCompat('this', 'tagId', 'integer');
  if (tagId === undefined) {
    throw new TypeError(
      `tagId is undefined. Please check the state of the item "${$.id}".`,
    );
  }

  const tagGroupId = $.getStateCompat('this', 'tagGroupId', 'integer') ?? null;

  tagController.send('toggleTag', {
    tagId,
    tagGroupId,
    player: player,
  } satisfies ToggleTagMessage);
  $.log(
    `Sent message to tag controller "${tagController.id}" to toggle tag "${tagId}" in tag group "${tagGroupId}" for player "${player.userId}"`,
  );
});

export type ToggleTagMessage = {
  tagId: number;
  tagGroupId: number | null;
  player: PlayerHandle;
};
