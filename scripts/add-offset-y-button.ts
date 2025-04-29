const tagController = $.worldItemReference('tagController');

$.onInteract((player) => {
  $.log(
    `player "${player.userId}" interacted with reset offset button "${$.id}"`,
  );

  const offsetY = $.getStateCompat('this', 'offsetY', 'float');
  if (offsetY === undefined) {
    throw new TypeError(
      `offsetY is undefined. Please check the state of the item "${$.id}".`,
    );
  }

  tagController.send('addOffsetY', {
    player,
    offsetY,
  } satisfies AddOffsetYMessage);
  $.log(
    `Sent message to tag controller "${tagController.id}" to reset offset Y for player "${player.userId}"`,
  );
});

export type AddOffsetYMessage = {
  player: PlayerHandle;
  offsetY: number;
};
