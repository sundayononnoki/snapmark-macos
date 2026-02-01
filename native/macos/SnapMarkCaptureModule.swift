// Swift (macOS 15+) - Native module skeleton for region selection + screenshot
//
// Implementation outline:
// 1) Create a borderless transparent NSWindow covering the active screen.
// 2) Track mouseDown/mouseDragged/mouseUp to get selection rect.
// 3) Capture image via CGWindowListCreateImage(selectionRect, .optionOnScreenOnly, kCGNullWindowID, .bestResolution)
// 4) Return PNG bytes / temporary file URL back to JS.
//
// Note: Requires Screen Recording permission.

import AppKit
import Foundation

final class SelectionOverlayWindowController: NSWindowController {
  // TODO: implement overlay view + selection drawing.
}

@objc(SnapMarkCaptureModule)
final class SnapMarkCaptureModule: NSObject {
  @objc
  func captureSelectedRegion(_ resolve: @escaping (Any?) -> Void, reject: @escaping (String, String, Error?) -> Void) {
    // TODO: present SelectionOverlayWindowController, then resolve with temp file path.
    reject("UNIMPLEMENTED", "captureSelectedRegion not wired into an Xcode target yet", nil)
  }
}
