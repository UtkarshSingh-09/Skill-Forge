import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { SimId, encodeRNToWeb, decodeWebToRN } from '../../sim/simProtocol';

import { HEX_DATA } from '../../../assets/sim/hexData';

const HEX_ASSETS: Partial<Record<SimId, string>> = HEX_DATA;

export interface SimulatorViewProps {
  simId: SimId;
  running: boolean;
  onLedState?: (pin: number, on: boolean) => void;
  onError?: (message: string) => void;
}

/**
 * Lane B's WebView host for the avr8js simulator (Master Plan §4.2).
 * Lane A (Devraj) composes this into AnalysePage/LearnPage layouts; Lane B
 * owns everything inside it (hex loading, run/stop, LED state bridging).
 */
export function SimulatorView({ simId, running, onLedState, onError }: SimulatorViewProps) {
  const webviewRef = useRef<WebView>(null);
  const [ready, setReady] = useState(false);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const msg = decodeWebToRN(event.nativeEvent.data);
        if (msg.type === 'READY') {
          setReady(true);
          const hexBase64 = HEX_ASSETS[simId];
          if (hexBase64) {
            webviewRef.current?.postMessage(encodeRNToWeb({ type: 'LOAD_HEX', simId, hexBase64 }));
          } else {
            onError?.(`No compiled hex bundled for ${simId} yet (Part 7 compile step pending).`);
          }
        } else if (msg.type === 'LED_STATE') {
          onLedState?.(msg.pin, msg.on);
        } else if (msg.type === 'ERROR') {
          onError?.(msg.message);
        }
      } catch (err) {
        onError?.(err instanceof Error ? err.message : 'SimulatorView: failed to parse WebView message');
      }
    },
    [simId, onLedState, onError]
  );

  React.useEffect(() => {
    if (!ready) return;
    webviewRef.current?.postMessage(encodeRNToWeb({ type: running ? 'RUN' : 'STOP' }));
  }, [running, ready]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        source={require('../../../assets/sim/index.html')}
        onMessage={handleMessage}
        originWhitelist={['*']}
        javaScriptEnabled
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1, backgroundColor: 'transparent' },
});
