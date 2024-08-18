import type {
  AnyPluginConfig,
  InferApi,
  InferOptions,
  InferTransforms,
  PluginConfig,
  SlatePlugin,
} from '../../lib';
import type {
  PlatePlugin,
  PlatePluginContext,
  PlatePluginMethods,
} from './PlatePlugin';

export type PlatePluginConfig<
  C extends AnyPluginConfig,
  EO = {},
  EA = {},
  ET = {},
> = {
  api?: EA & Partial<InferApi<C>>;
  options?: EO & Partial<InferOptions<C>>;
  transforms?: ET & Partial<InferTransforms<C>>;
} & Omit<
  Partial<
    PlatePlugin<
      PluginConfig<
        C['key'],
        EO & InferOptions<C>,
        EA & InferApi<C>,
        ET & InferTransforms<C>
      >
    >
  >,
  'api' | 'options' | 'transforms' | keyof PlatePluginMethods
>;

/**
 * Extends a SlatePlugin to create a React PlatePlugin.
 *
 * @remarks
 *   This function transforms a SlatePlugin into a React PlatePlugin, allowing for
 *   React-specific functionality to be added.
 * @param basePlugin - The base SlatePlugin to be extended.
 * @param extendConfig - A function or object that provides the extension
 *   configuration. If a function, it receives the plugin context and should
 *   return a partial PlatePlugin. If an object, it should be a partial
 *   PlatePlugin configuration.
 * @returns A new PlatePlugin that combines the base SlatePlugin functionality
 *   with React-specific features defined in the extension configuration.
 */
export function extendPlatePlugin<
  C extends AnyPluginConfig,
  EO = {},
  EA = {},
  ET = {},
>(
  slatePlugin: SlatePlugin<C>,
  extendConfig:
    | ((ctx: PlatePluginContext<C>) => PlatePluginConfig<C, EO, EA, ET>)
    | PlatePluginConfig<C, EO, EA, ET>
): PlatePlugin<
  PluginConfig<
    C['key'],
    EO & InferOptions<C>,
    EA & InferApi<C>,
    ET & InferTransforms<C>
  >
> {
  const extendedPlugin = slatePlugin.extend(extendConfig as any);

  return extendedPlugin as any;
}

type ExtendPluginConfig<C extends AnyPluginConfig = PluginConfig> = Omit<
  Partial<
    PlatePlugin<
      PluginConfig<
        C['key'],
        Partial<InferOptions<C>>,
        Partial<InferApi<C>>,
        Partial<InferTransforms<C>>
      >
    >
  >,
  keyof PlatePluginMethods
>;

/**
 * Explicitly typed version of {@link extendPlatePlugin}.
 *
 * @remarks
 *   This function requires explicit type parameters for both the base plugin
 *   configuration and the extension configuration. Use this when you need
 *   precise control over the plugin's type structure or when type inference
 *   doesn't provide the desired result.
 * @typeParam C - The type of the extension configuration for the PlatePlugin
 *   (required).
 * @typeParam TContext - The type of the base SlatePlugin configuration
 *   (optional).
 */
export function extendTPlatePlugin<
  C extends AnyPluginConfig = PluginConfig,
  TContext extends AnyPluginConfig = AnyPluginConfig,
>(
  basePlugin: SlatePlugin<TContext>,
  extendConfig:
    | ((ctx: PlatePluginContext<TContext>) => ExtendPluginConfig<C>)
    | ExtendPluginConfig<C>
): PlatePlugin<
  PluginConfig<C['key'], InferOptions<C>, InferApi<C>, InferTransforms<C>>
> {
  const extendedPlugin = basePlugin.extend(extendConfig as any);

  return extendedPlugin as any;
}
