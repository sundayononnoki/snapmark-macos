// Swift (macOS 15+) - Native module skeleton for global hotkey
//
// This file is intended to live inside the React Native macOS target (Xcode project)
// and be exposed via RCTBridgeModule.
//
// Key ideas:
// - RegisterEventHotKey (Carbon) for true global hotkey
// - On trigger: present selection overlay window

import Foundation
import Carbon

@objc(SnapMarkHotkeyModule)
final class SnapMarkHotkeyModule: NSObject {
  private var hotKeyRef: EventHotKeyRef?
  private var eventHandlerRef: EventHandlerRef?

  @objc
  func start(_ keyCode: NSNumber, modifiers: NSNumber) {
    // Example: keyCode = kVK_ANSI_9, modifiers = cmdKey | shiftKey
    let signature = OSType(0x534D4B59) // 'SMKY'
    var hotKeyID = EventHotKeyID(signature: signature, id: 1)

    let status = RegisterEventHotKey(
      UInt32(truncating: keyCode),
      UInt32(truncating: modifiers),
      hotKeyID,
      GetApplicationEventTarget(),
      0,
      &hotKeyRef
    )

    guard status == noErr else {
      NSLog("RegisterEventHotKey failed: \(status)")
      return
    }

    var eventType = EventTypeSpec(eventClass: OSType(kEventClassKeyboard), eventKind: UInt32(kEventHotKeyPressed))
    InstallEventHandler(GetApplicationEventTarget(), { _, eventRef, userData in
      // TODO: call back into JS or directly start capture flow
      NSLog("SnapMark hotkey pressed")
      return noErr
    }, 1, &eventType, nil, &eventHandlerRef)
  }

  @objc
  func stop() {
    if let ref = hotKeyRef {
      UnregisterEventHotKey(ref)
      hotKeyRef = nil
    }
    if let handler = eventHandlerRef {
      RemoveEventHandler(handler)
      eventHandlerRef = nil
    }
  }
}
