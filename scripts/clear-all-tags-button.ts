import type { DestroyPersonalTagBoardMessage } from './personal-tag-board';

const tagController = $.worldItemReference('tagController');

$.onInteract((player) => {
  $.log(`player "${player.userId}" interacted with tag clear button "${$.id}"`);

  tagController.send('destroyPersonalTagBoard', {
    player: player,
    destroyed: false,
  } satisfies DestroyPersonalTagBoardMessage);
  $.log(
    `Sent message to tag controller "${tagController.id}" to destroy personal tag board for player "${player.userId}"`,
  );
});
