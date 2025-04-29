import { createItemMessageHandlerStorage } from '../tools/message-handler-storage';
import type { AddOffsetYMessage } from './add-offset-y-button';
import type { DestroyPersonalTagBoardMessage } from './personal-tag-board';
import type { ResetOffsetYMessage } from './reset-offset-y-button';
import type { ToggleTagMessage } from './toggle-tag-button';

const tagBoardTemplate = new WorldItemTemplateId('personalTagBoard');

const createPersonalTagBoard = (player: PlayerHandle) => {
  if ($.state.personalTagBoards == null) {
    $.log('initializing personalTagBoards state');
    $.state.personalTagBoards = {};
  }

  const tagBoard = $.createItem(
    tagBoardTemplate,
    $.getPosition(),
    $.getRotation(),
  );

  $.state.personalTagBoards = {
    ...$.state.personalTagBoards,
    [player.id]: tagBoard,
  };

  $.log(
    `Created personal tag board ${tagBoard.id} for ${player.userDisplayName} (userId: ${player.userId}, id: ${player.id}).`,
  );
  return tagBoard;
};

const toggleTag = (message: ToggleTagMessage) => {
  const { tagId, tagGroupId, player } = message;

  const tagBoard =
    $.state.personalTagBoards?.[player.id] ?? createPersonalTagBoard(player);

  tagBoard.send('toggleTag', {
    tagId,
    tagGroupId,
    player,
    controller: $.itemHandle,
  } satisfies ToggleTagMessageFromController);
  $.log(
    `Sent message to personal tag board "${tagBoard.id}" to toggle tag "${tagId}" in tag group "${tagGroupId}" for player "${player.userId}"`,
  );
};

const destroyPersonalTagBoard = (message: DestroyPersonalTagBoardMessage) => {
  if ($.state.personalTagBoards != null) {
    const { [message.player.id]: tagBoard, ...rest } =
      $.state.personalTagBoards;
    $.state.personalTagBoards = rest;
    $.log(
      `Personal tag board ${tagBoard?.id} for ${message.player.userId} is removed from state.`,
    );
    if (!message.destroyed) {
      tagBoard?.send('destroy', null);
      $.log(
        `Sent message to personal tag board "${tagBoard?.id}" to destroy it for player "${message.player.userId}"`,
      );
    }
  }
};

const resetOffsetY = (message: ResetOffsetYMessage) => {
  const tagBoard = $.state.personalTagBoards?.[message.player.id];
  if (tagBoard == null) {
    $.log(
      `Personal tag board for player "${message.player.userId}" not found in state.`,
    );
    return;
  }

  tagBoard.send('resetOffsetY', null);
  $.log(
    `Sent message to personal tag board "${tagBoard.id}" to reset offset Y for player "${message.player.userId}"`,
  );
};

const addOffsetY = (message: AddOffsetYMessage) => {
  const tagBoard = $.state.personalTagBoards?.[message.player.id];
  if (tagBoard == null) {
    $.log(
      `Personal tag board for player "${message.player.userId}" not found in state.`,
    );
    return;
  }
  tagBoard.send('addOffsetY', {
    offsetY: message.offsetY,
    player: message.player,
  });
  $.log(
    `Sent message to personal tag board "${tagBoard.id}" to add offset Y "${message.offsetY}" for player "${message.player.userId}"`,
  );
};

const messageHandlerStorage = createItemMessageHandlerStorage();
messageHandlerStorage.register('toggleTag', toggleTag);
messageHandlerStorage.register(
  'destroyPersonalTagBoard',
  destroyPersonalTagBoard,
);
messageHandlerStorage.register('resetOffsetY', resetOffsetY);
messageHandlerStorage.register('addOffsetY', addOffsetY);

export type ToggleTagMessageFromController = ToggleTagMessage & {
  controller: ItemHandle;
};
