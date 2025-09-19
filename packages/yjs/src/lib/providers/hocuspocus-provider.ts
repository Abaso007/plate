import type {
  HocuspocusProviderConfiguration,
  HocuspocusProviderWebsocketConfiguration,
  onDisconnectParameters,
  onSyncedParameters,
} from '@hocuspocus/provider';
import type { Awareness } from 'y-protocols/awareness';
import type * as Y from 'yjs';

import { HocuspocusProvider, HocuspocusProviderWebsocket } from '@hocuspocus/provider';

import type {
  ProviderEventHandlers,
  UnifiedProvider,
  YjsProviderType,
} from './types';

export class HocuspocusProviderWrapper implements UnifiedProvider {
  private _isConnected = false;
  private _isSynced = false;
  private onConnect?: () => void;
  private onDisconnect?: () => void;
  private onError?: (error: Error) => void;
  private onSyncChange?: (isSynced: boolean) => void;
  private provider: HocuspocusProvider;

  destroy = () => {
    if (this._isConnected) {
      this.provider.disconnect();
    }
  };
  disconnect = () => {
    if (this._isConnected) {
      this.provider.disconnect();
      this._isConnected = false;

      // If we were synced, notify about sync state change
      if (this._isSynced) {
        this._isSynced = false;
        this?.onSyncChange?.(false);
      }
    }
  };

  type: YjsProviderType = 'hocuspocus';

  constructor({
    awareness,
    doc,
    options,
    wsOptions,
    onConnect,
    onDisconnect,
    onError,
    onSyncChange,
  }: {
    options: HocuspocusProviderConfiguration;
    wsOptions?: HocuspocusProviderWebsocketConfiguration;
    awareness?: Awareness;
    doc?: Y.Doc;
  } & ProviderEventHandlers) {
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
    this.onSyncChange = onSyncChange;
    this.onError = onError;

    // If an existing Y.Doc is provided, ensure it's passed to the HocuspocusProvider
    const providerOptions: HocuspocusProviderConfiguration = {
      ...options,
      ...(doc && { document: doc }),
      ...(awareness && { awareness }),
      ...(wsOptions && { websocketProvider: new HocuspocusProviderWebsocket(wsOptions) }),
      // Disable broadcast channel here - we'll manually handle connections
      broadcast: options.broadcast || false,
      onAwarenessChange: options.onAwarenessChange || (() => {}),
      onConnect: () => {
        this._isConnected = true;
        this.onConnect?.();
        options.onConnect?.();
      },
      onDisconnect: (data: onDisconnectParameters) => {
        this._isConnected = false;

        // If we were synced, notify about sync state change
        if (this._isSynced) {
          this._isSynced = false;
          this.onSyncChange?.(false);
        }

        this.onDisconnect?.();
        options.onDisconnect?.(data);
      },
      onSynced: (data: onSyncedParameters) => {
        const wasSynced = this._isSynced;
        this._isSynced = true;

        // Call onSyncChange only when sync state changes
        if (!wasSynced) {
          this.onSyncChange?.(true);
        }

        options.onSynced?.(data);
      },
    };

    try {
      this.provider = new HocuspocusProvider(providerOptions);
    } catch (error) {
      // Create a minimal provider that won't try to connect
      this.provider = new HocuspocusProvider({
        ...providerOptions,
        connect: false,
      });
      this.onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }

  connect() {
    try {
      void this.provider.connect();
    } catch (error) {
      this._isConnected = false;
    }
  }

  get awareness() {
    return this.provider.awareness!;
  }

  get document() {
    return this.provider.document;
  }

  get isConnected() {
    return this._isConnected;
  }

  get isSynced() {
    return this._isSynced;
  }
}
