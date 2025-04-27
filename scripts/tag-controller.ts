import { createItemMessageHandlerStorage } from '../tools/message-handler-storage';
import type { DestroyPersonalTagBoardMessage } from './personal-tag-board';
import type { ToggleTagMessage } from './tag-button';

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

const destroyPersonalTagBoard = (message: DestroyPersonalTagBoardMessage) => {
  if ($.state.personalTagBoards == null) {
    return;
  }
  const { [message.player.id]: _, ...rest } = $.state.personalTagBoards;
  $.state.personalTagBoards = rest;
};

const toggleTag = (message: ToggleTagMessage) => {
  if ($.state.personalTagBoards == null) {
    $.log('initializing personalTagBoards state');
    $.state.personalTagBoards = {};
  }

  const { tagId, player } = message;

  const tagBoard =
    $.state.personalTagBoards[player.id] ?? createPersonalTagBoard(player);

  tagBoard.send('toggleTag', {
    tagId,
    player,
    controller: $.itemHandle,
  } satisfies ToggleTagMessageFromController);
  $.log(
    `Sent message to personal tag board "${tagBoard.id}" to toggle tag "${tagId}" for player "${player.userId}"`,
  );
};

const messageHandlerStorage = createItemMessageHandlerStorage();
messageHandlerStorage.register('toggleTag', toggleTag);
messageHandlerStorage.register(
  'destroyPersonalTagBoard',
  destroyPersonalTagBoard,
);

export type ToggleTagMessageFromController = ToggleTagMessage & {
  controller: ItemHandle;
};
