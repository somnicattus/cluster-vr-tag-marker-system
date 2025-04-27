import { createItemMessageHandlerStorage } from '../tools/message-handler-storage';
import type { ToggleTagMessageFromController } from './tag-controller';

const messageHandlerStorage = createItemMessageHandlerStorage();
const offsetY = 2;

messageHandlerStorage.register(
  'toggleTag',
  (message: ToggleTagMessageFromController) => {
    $.state.controller = message.controller;
    $.state.owner = message.player;
    const tag = $.subNode(`Tag${message.tagId}`);
    const enabled = tag.getEnabled();
    if (enabled === undefined) {
      throw new TypeError(`Personal tag "${message.tagId}" not found.`);
    }
    const toggleMessage = enabled ? 'disabled' : 'enabled';
    $.log(
      `Personal tag "${message.tagId}" ${toggleMessage} for player "${message.player.userId}"`,
    );
    tag.setEnabled(!enabled);
  },
);

$.onUpdate(() => {
  $.state;
  const owner = $.state.owner;
  if (owner == null) {
    return;
  }
  // TODO: Use camera position if camera API is available as non-beta feature
  const position = owner.getPosition();
  const rotation = owner.getRotation();
  if (position == null || rotation == null) {
    $.log(
      `Owner ${owner.userDisplayName} (userId: ${owner.userId}, id: ${owner.id}). not found. Destroying personal tag board ${$.id}.`,
    );
    $.destroy();

    $.state.controller?.send('destroyPersonalTagBoard', {
      player: owner,
    } satisfies DestroyPersonalTagBoardMessage);
    return;
  }
  position.y += offsetY;
  rotation.multiply(Quaternion.euler(0, 180, 0));
  $.setPosition(position);
  $.setRotation(rotation);
});

export type DestroyPersonalTagBoardMessage = {
  player: PlayerHandle;
};
