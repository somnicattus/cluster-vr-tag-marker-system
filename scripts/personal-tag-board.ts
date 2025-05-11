import { debounce } from '../tools/debounce';
import { createItemMessageHandlerStorage } from '../tools/message-handler-storage';
import type { AddOffsetYMessage } from './add-offset-y-button';
import type { DestroyPersonalTagBoardMessage } from './clear-all-tags-button';
import type { ToggleTagMessageFromController } from './tag-controller';

const messageHandlerStorage = createItemMessageHandlerStorage();

const toggleTagGroup = (
  message: ToggleTagMessageFromController,
  tagEnabled: boolean,
) => {
  const { tagId, tagGroupId, player } = message;
  const tagGroup = $.subNode(`TagGroup${tagGroupId}`);

  const groupEnabled = tagGroup.getEnabled();
  if (groupEnabled === undefined) {
    throw new TypeError(`Personal tag group "${tagGroupId}" not found.`);
  }

  if (tagEnabled) {
    const enabledTagsInGroup = [
      ...($.state.enabledTags?.[tagGroupId] ?? []),
      tagId,
    ];
    $.state.enabledTags = {
      ...$.state.enabledTags,
      [tagGroupId]: enabledTagsInGroup,
    };

    if (!groupEnabled) {
      tagGroup.setEnabled(true);
      $.log(
        `Personal tag group "${tagGroupId}" enabled for player "${player.userId}"`,
      );
    }
  } else {
    const enabledTagsInGroup = ($.state.enabledTags?.[tagGroupId] ?? []).filter(
      (id) => id !== tagId,
    );
    $.state.enabledTags = {
      ...$.state.enabledTags,
      [tagGroupId]: enabledTagsInGroup,
    };

    if (enabledTagsInGroup.length === 0 && groupEnabled) {
      tagGroup.setEnabled(false);
      $.log(
        `Personal tag group "${tagGroupId}" disabled for player "${player.userId}"`,
      );
    }
  }
};

const toggleTag = (message: ToggleTagMessageFromController) => {
  const { tagId, player, controller } = message;

  $.state.controller = controller;
  $.state.owner = player;

  const tag = $.subNode(`Tag${tagId}`);

  let enabled = tag.getEnabled();
  if (enabled === undefined) {
    throw new TypeError(`Personal tag "${tagId}" not found.`);
  }
  enabled = !enabled;

  toggleTagGroup(message, enabled);

  tag.setEnabled(enabled);

  $.log(
    `Personal tag "${tagId}" ${enabled ? 'enabled' : 'disabled'} for player "${player.userId}"`,
  );
};

const destroy = () => {
  $.destroy();
  $.log(`Personal tag board for player "${$.state.owner?.userId}" destroyed.`);
};

const getOffsetY = () => {
  const offsetY = $.state.offsetY;
  if (offsetY == null) {
    const offsetY = $.getStateCompat('this', 'defaultOffsetY', 'float') ?? 0;
    $.state.offsetY = offsetY;
    return offsetY;
  }
  return offsetY;
};

const resetOffsetY = () => {
  $.state.offsetY = null;
  $.log(
    `Personal tag board offset Y reset for player "${$.state.owner?.userId}"`,
  );
};

const addOffsetY = (message: AddOffsetYMessage) => {
  const offsetY = getOffsetY();
  const newOffsetY = offsetY + message.offsetY;
  $.state.offsetY = newOffsetY;
  $.log(
    `Personal tag board offset Y changed from ${offsetY} to ${newOffsetY} for player "${$.state.owner?.userId}"`,
  );
};

messageHandlerStorage.register('toggleTag', toggleTag);
messageHandlerStorage.register('destroy', destroy);
messageHandlerStorage.register('addOffsetY', addOffsetY);
messageHandlerStorage.register('resetOffsetY', resetOffsetY);

const onUpdate = () => {
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
      destroyed: true,
    } satisfies DestroyPersonalTagBoardMessage);

    return;
  }

  position.y += getOffsetY();
  $.setPosition(position);
  $.setRotation(rotation);
};

$.onUpdate(debounce(onUpdate, 1 / 10));
