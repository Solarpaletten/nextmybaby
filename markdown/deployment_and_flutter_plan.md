# Render Auto-Deploy + Flutter Wrapper Implementation Plan

## Phase 1: Render Auto-Deploy Setup

### Step 1: Connect GitHub to Render
1. **В Render Dashboard:**
   - Service → Settings → Build & Deploy
   - Connect Repository → `Solarpaletten/nextjs`
   - Branch: `main`
   - Auto-Deploy: `Yes`

2. **Build Settings:**
   ```
   Build Command: pnpm install && pnpm build
   Start Command: pnpm start
   ```

3. **Environment Variables:**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_APP_NAME=DashkaSolarTemplate
   ```

### Step 2: Test Auto-Deploy
```bash
# Создать тестовый коммит в main
git checkout main
echo "<!-- Auto-deploy test -->" >> README.md
git add README.md
git commit -m "test: verify auto-deploy functionality"
git push origin main
```

Render должен автоматически пересобрать и развернуть изменения.

## Phase 2: Flutter Wrapper Creation

### Step 1: Flutter Project Setup
```bash
# Создать Flutter проект
flutter create nextjs_mobile_wrapper
cd nextjs_mobile_wrapper

# Добавить зависимости
flutter pub add webview_flutter
flutter pub add connectivity_plus  # для проверки интернета
```

### Step 2: Basic WebView Implementation

**File: `lib/main.dart`**
```dart
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

void main() {
  runApp(NextJSWrapperApp());
}

class NextJSWrapperApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Dashka Solar Template',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: WebViewScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class WebViewScreen extends StatefulWidget {
  @override
  _WebViewScreenState createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  late final WebViewController _controller;
  bool _isLoading = true;
  bool _hasError = false;

  final String _baseUrl = 'https://next-solar.onrender.com';

  @override
  void initState() {
    super.initState();
    _initializeWebView();
    _checkConnectivity();
  }

  void _initializeWebView() {
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0x00000000))
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (int progress) {
            if (progress == 100) {
              setState(() {
                _isLoading = false;
              });
            }
          },
          onPageStarted: (String url) {
            setState(() {
              _isLoading = true;
              _hasError = false;
            });
          },
          onPageFinished: (String url) {
            setState(() {
              _isLoading = false;
            });
          },
          onWebResourceError: (WebResourceError error) {
            setState(() {
              _isLoading = false;
              _hasError = true;
            });
          },
        ),
      )
      ..loadRequest(Uri.parse(_baseUrl));
  }

  void _checkConnectivity() async {
    var connectivityResult = await (Connectivity().checkConnectivity());
    if (connectivityResult == ConnectivityResult.none) {
      setState(() {
        _hasError = true;
        _isLoading = false;
      });
    }
  }

  void _refresh() {
    setState(() {
      _isLoading = true;
      _hasError = false;
    });
    _controller.reload();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Stack(
          children: [
            if (!_hasError)
              WebViewWidget(controller: _controller),
            
            if (_hasError)
              _buildErrorWidget(),
            
            if (_isLoading)
              const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
                    ),
                    SizedBox(height: 16),
                    Text(
                      'Loading Dashka Solar Template...',
                      style: TextStyle(fontSize: 16, color: Colors.grey),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorWidget() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            const Text(
              'Connection Error',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Unable to connect to the server. Please check your internet connection.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _refresh,
              child: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### Step 3: Platform Configuration

**Android (`android/app/src/main/AndroidManifest.xml`):**
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

**iOS (`ios/Runner/Info.plist`):**
```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

### Step 4: App Icons and Metadata

**File: `pubspec.yaml`**
```yaml
name: nextjs_mobile_wrapper
description: Mobile wrapper for Dashka Solar NextJS Template
version: 1.0.0+1

flutter:
  uses-material-design: true
  assets:
    - assets/icons/

flutter_icons:
  android: "launcher_icon"
  ios: true
  image_path: "assets/icons/app_icon.png"
```

## Phase 3: Testing and Build

### Step 1: Local Testing
```bash
# Android Emulator
flutter run -d android

# iOS Simulator  
flutter run -d ios
```

### Step 2: Build for Distribution
```bash
# Android APK
flutter build apk --release

# iOS (requires Xcode and Apple Developer account)
flutter build ios --release
```

## Phase 4: Deployment Strategy

### App Store Submission Requirements:
1. **Native functionality beyond WebView:**
   - Add splash screen
   - Implement offline caching
   - Add push notifications capability
   - Include native navigation

2. **Store Descriptions:**
   - Focus on business functionality
   - Highlight multi-platform synchronization
   - Emphasize real-time updates

### Technical Advantages:
- ✅ Single Next.js codebase serves web + mobile
- ✅ Automatic updates via Render auto-deploy
- ✅ Consistent UI/UX across platforms  
- ✅ Reduced development/maintenance costs

### Potential Challenges:
- WebView performance limitations
- App store approval requirements for hybrid apps
- Platform-specific native features integration
- Offline functionality requirements

## Implementation Timeline:
1. **Week 1:** Render auto-deploy setup and testing
2. **Week 2:** Basic Flutter wrapper with WebView
3. **Week 3:** Enhanced features (offline, splash, error handling)
4. **Week 4:** Platform builds and store submission prep

---

**Result:** Universal template accessible via web browser, iOS App Store, and Google Play Store from a single Next.js codebase.