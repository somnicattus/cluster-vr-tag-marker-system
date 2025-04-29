const tagController = $.worldItemReference('tagController');

$.onInteract((player) => {
  $.log(
    `player "${player.userId}" interacted with reset offset button "${$.id}"`,
  );

  tagController.send('resetOffsetY', {
    player: player,
  } satisfies ResetOffsetYMessage);
  $.log(
    `Sent message to tag controller "${tagController.id}" to reset offset Y for player "${player.userId}"`,
  );
});

export type ResetOffsetYMessage = {
  player: PlayerHandle;
};
