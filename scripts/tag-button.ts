const tagController = $.worldItemReference('tagController');

$.onInteract((player) => {
  const tagId = $.getStateCompat('this', 'tagId', 'integer');
  if (tagId === undefined) {
    throw new TypeError(
      `tagId is undefined. Please check the state of the item "${$.id}".`,
    );
  }
  $.log(`player "${player.userId}" interacted with tag button "${tagId}"`);
  tagController.send('toggleTag', {
    tagId,
    player: player,
  } satisfies ToggleTagMessage);
  $.log(
    `Sent message to tag controller "${tagController.id}" to toggle tag "${tagId}" for player "${player.userId}"`,
  );
});

export type ToggleTagMessage = {
  tagId: number;
  player: PlayerHandle;
};
