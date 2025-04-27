type onReceiveOptions = {
  item?: boolean;
  player?: boolean;
};

type SendableHandle<Opts extends onReceiveOptions> =
  | (Opts['item'] extends false ? never : ItemHandle)
  | (Opts['player'] extends true ? PlayerHandle : never);

type MessageHandler<
  Arg extends Sendable | PlayerScriptSendable,
  Sender extends ItemHandle | PlayerHandle,
> = (arg: Arg, sender: Sender) => void;

/**
 * 複数のメッセージハンドラを `$.onReceive()` に登録するストレージを作成します。
 *
 * メッセージハンドラが受け取る引数の型を楽観的に指定することができますが、実際には異なる型を受け取ることがあります。
 *
 * 2 回以上呼び出した場合、それ以前に作成したストレージのメッセージハンドラは無効になります。
 *
 * @param options - オプションの設定
 * @param options.item - アイテムからのメッセージを受け取るかどうか
 * @param options.player - プレイヤーからのメッセージを受け取るかどうか
 * @returns メッセージハンドラを登録するためのストレージ
 * @example
 * ```ts
 * const { registerMessageHandler } = createMessageHandlerStorage({
 *   item: false,
 *   player: true,
 * });
 * registerMessageHandler('initialize', (arg: number, sender: PlayerHandler) => {
 *   $.log(`player "${sender.userId}" initialized gimmick "${$.id}" with arg "${arg.toFixed(2)}"`);
 * });
 * ```
 */
export const createItemMessageHandlerStorage = <
  Opts extends onReceiveOptions = { item: true; player: false },
>(
  options?: Opts,
) => {
  const handlers: Record<
    string,
    MessageHandler<Sendable, SendableHandle<Opts>>
  > = {};
  const _options = { item: true, player: false, ...options };
  $.onReceive((messageType, arg, sender) => {
    const handler = handlers[messageType];
    if (handler) {
      handler(arg, sender as never);
    } else {
      $.log(`No handler for message type "${messageType}"`);
    }
  }, _options);
  return {
    register: <Arg extends Sendable, Sender extends SendableHandle<Opts>>(
      messageType: string,
      handler: MessageHandler<Arg, Sender>,
    ): void => {
      // biome-ignore lint/suspicious/noExplicitAny: Optimistic type
      handlers[messageType] = handler as any;
    },
  };
};

/**
 * 複数のメッセージハンドラを `_.onReceive()` に登録するストレージを作成します。
 *
 * メッセージハンドラが受け取る引数の型を楽観的に指定することができますが、実際には異なる型を受け取ることがあります。
 *
 * 2 回以上呼び出した場合、それ以前に作成したストレージのメッセージハンドラは無効になります。
 *
 * @param options - オプションの設定
 * @param options.item - アイテムからのメッセージを受け取るかどうか
 * @param options.player - プレイヤーからのメッセージを受け取るかどうか
 * @returns メッセージハンドラを登録するためのストレージ
 * @example
 * ```ts
 * const { registerMessageHandler } = createMessageHandlerStorage({
 *   item: true,
 *   player: false,
 * });
 * registerMessageHandler('initialize', (arg: number, sender: ItemHandler) => {
 *   _.log(`player "${_.userId}" received message "${arg}" from item "${_.id}"`);
 * });
 * ```
 */
export const createPlayerMessageHandlerStorage = <
  Opts extends onReceiveOptions = { item: true; player: false },
>(
  options?: Opts,
) => {
  const handlers: Record<
    string,
    MessageHandler<PlayerScriptSendable, SendableHandle<Opts>>
  > = {};
  const _options = { item: true, player: false, ...options };
  $.onReceive((messageType, arg, sender) => {
    const handler = handlers[messageType];
    if (handler) {
      handler(arg, sender as never);
    } else {
      $.log(`No handler for message type "${messageType}"`);
    }
  }, _options);
  return {
    register: <Arg extends Sendable, Sender extends SendableHandle<Opts>>(
      messageType: string,
      handler: MessageHandler<Arg, Sender>,
    ): void => {
      // biome-ignore lint/suspicious/noExplicitAny: Optimistic type
      handlers[messageType] = handler as any;
    },
  };
};
