import { debounce } from '../tools/debounce';
import { createItemMessageHandlerStorage } from '../tools/message-handler-storage';
import type { AddOffsetYMessage } from './add-offset-y-button';
import type { DestroyPersonalTagBoardMessage } from './clear-all-tags-button';
import type { ToggleTagMessageFromController } from './tag-controller';

const messageHandlerStorage = createItemMessageHandlerStorage();

const toggleTagGroup = (
  message: ToggleTagMessageFromController & { tagGroupId: number },
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

  if ($.getStateCompat('this', 'useTagGroup', 'boolean')) {
    if (message.tagGroupId == null) {
      throw new TypeError(
        `Tag group ID is not defined. Please check the state of the toggle button for tag "${tagId}".`,
      );
    }
    toggleTagGroup(
      message as typeof message & { tagGroupId: typeof message.tagGroupId },
      enabled,
    );
  }

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

const KEEP_BEFORE_DESTROY_SECONDS = 2;
const onOwnerNotFound = (owner: PlayerHandle, deltaTime: number) => {
  // Keep the board for 5 seconds in case of player connection issues
  if ($.state.ownerNotFoundForSeconds == null) {
    $.state.ownerNotFoundForSeconds = 0;
  }

  $.state.ownerNotFoundForSeconds += deltaTime;
  if ($.state.ownerNotFoundForSeconds < KEEP_BEFORE_DESTROY_SECONDS) {
    return;
  }

  $.log(
    `Owner ${owner.userDisplayName} (userId: ${owner.userId}, id: ${owner.id}) not found for ${KEEP_BEFORE_DESTROY_SECONDS} seconds. Destroying personal tag board ${$.id}.`,
  );

  $.destroy();
  $.state.controller?.send('destroyPersonalTagBoard', {
    player: owner,
    destroyed: true,
  } satisfies DestroyPersonalTagBoardMessage);
};

const setPositionAndRotation = (owner: PlayerHandle) => {
  const useHumanoidBone =
    $.getStateCompat('this', 'useHumanoidBone', 'boolean') ?? false;

  const position =
    (useHumanoidBone
      ? (owner.getHumanoidBonePosition(HumanoidBone.Head) ??
        // Fallback to 1.5m above the player's feet if head bone is not found
        owner
          .getPosition()
          ?.add(new Vector3(0, 1.5, 0)))
      : owner.getPosition()) ?? null;

  // TODO: Use Local UI Renderer
  const rotation =
    (useHumanoidBone
      ? owner.getHumanoidBoneRotation(HumanoidBone.Head)
      : // Fallback to the player's rotation if head bone is not found
        undefined) ?? owner.getRotation();
  if (position == null || rotation == null) {
    $.log(
      `Owner ${owner.userDisplayName} (userId: ${owner.userId}, id: ${owner.id}). position or rotation not found.`,
    );
    return;
  }

  position.y += getOffsetY();
  const eulerRotation = rotation.createEulerAngles();
  eulerRotation.x = 0;
  eulerRotation.z = 0;
  const quaternionRotation = Quaternion.euler(eulerRotation);

  $.setPosition(position);
  $.setRotation(quaternionRotation);
};

const onUpdate = (deltaTime: number) => {
  const owner = $.state.owner;
  if (owner == null) {
    return;
  }

  if (!owner.exists()) {
    onOwnerNotFound(owner, deltaTime);
    return;
  }
  $.state.ownerNotFoundForSeconds = 0;
  setPositionAndRotation(owner);
};

$.onUpdate(debounce(onUpdate, 1 / 10));
