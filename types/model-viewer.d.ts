declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string
        alt?: string
        'auto-rotate'?: string | boolean
        'rotation-per-second'?: string
        'camera-controls'?: string | boolean
        'disable-zoom'?: string | boolean
        'disable-pan'?: string | boolean
        'disable-tap'?: string | boolean
        'interaction-prompt'?: string
        'shadow-intensity'?: string
        exposure?: string
        loading?: string
        reveal?: string
      },
      HTMLElement
    >
  }
}
