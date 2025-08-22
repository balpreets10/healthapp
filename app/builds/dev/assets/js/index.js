var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import { r as reactExports, j as jsxDevRuntimeExports, u as useNavigate, B as BrowserRouter, R as Routes, a as Route, N as Navigate, b as useLocation, c as createRoot } from "./vendor-react.js";
import { c as createClient } from "./vendor-other.js";
var require_js = __commonJS({
  "assets/js/index.js"(exports) {
    (function polyfill() {
      const relList = document.createElement("link").relList;
      if (relList && relList.supports && relList.supports("modulepreload")) {
        return;
      }
      for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
        processPreload(link);
      }
      new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type !== "childList") {
            continue;
          }
          for (const node of mutation.addedNodes) {
            if (node.tagName === "LINK" && node.rel === "modulepreload")
              processPreload(node);
          }
        }
      }).observe(document, { childList: true, subtree: true });
      function getFetchOpts(link) {
        const fetchOpts = {};
        if (link.integrity)
          fetchOpts.integrity = link.integrity;
        if (link.referrerPolicy)
          fetchOpts.referrerPolicy = link.referrerPolicy;
        if (link.crossOrigin === "use-credentials")
          fetchOpts.credentials = "include";
        else if (link.crossOrigin === "anonymous")
          fetchOpts.credentials = "omit";
        else
          fetchOpts.credentials = "same-origin";
        return fetchOpts;
      }
      function processPreload(link) {
        if (link.ep)
          return;
        link.ep = true;
        const fetchOpts = getFetchOpts(link);
        fetch(link.href, fetchOpts);
      }
    })();
    const index = "";
    const variables = "";
    const _NavigationManager = class _NavigationManager {
      constructor() {
        __publicField(this, "element", null);
        __publicField(this, "state");
        __publicField(this, "config");
        __publicField(this, "subscribers", /* @__PURE__ */ new Set());
        __publicField(this, "keyboardHandler", null);
        __publicField(this, "mouseHandler", null);
        __publicField(this, "touchHandler", null);
        __publicField(this, "resizeObserver", null);
        __publicField(this, "isInitialized", false);
        __publicField(this, "isAuthenticated", false);
        this.config = {
          items: [
            {
              id: "home",
              label: "Home",
              href: "/",
              position: 0,
              disabled: false,
              requiresAuth: false,
              ariaLabel: "Navigate to Home"
            },
            {
              id: "add-meals",
              label: "Add Meals",
              href: "/add-meals",
              position: 1,
              disabled: false,
              requiresAuth: true,
              ariaLabel: "Navigate to Add Meals"
            },
            {
              id: "journal",
              label: "Journal",
              href: "/journal",
              position: 2,
              disabled: false,
              requiresAuth: true,
              ariaLabel: "Navigate to Health Journal"
            },
            {
              id: "profile",
              label: "Profile",
              href: "/profile",
              position: 3,
              disabled: false,
              requiresAuth: true,
              ariaLabel: "Navigate to Profile"
            }
          ],
          animationDuration: 300,
          radius: 120,
          centerSize: 60,
          itemSize: 50,
          autoClose: true,
          closeDelay: 1e3,
          enableKeyboard: true,
          enableTouch: true,
          centerIcon: "menu",
          centerLabel: "Menu"
        };
        this.state = {
          isOpen: false,
          activeItem: this.getActiveItemFromPath(),
          hoveredItem: null,
          focusedItem: null,
          keyboardMode: false,
          isAnimating: false
        };
        this.init();
      }
      static getInstance() {
        if (!_NavigationManager.instance) {
          _NavigationManager.instance = new _NavigationManager();
        }
        return _NavigationManager.instance;
      }
      init() {
        if (this.isInitialized)
          return;
        this.setupEventListeners();
        this.setupRouterListeners();
        this.isInitialized = true;
        console.log("✅ NavigationManager initialized - router-based navigation enabled");
      }
      /**
       * NEW: Listen for route changes to update active item
       */
      setupRouterListeners() {
        window.addEventListener("popstate", () => {
          this.updateActiveItemFromPath();
        });
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        history.pushState = (...args) => {
          originalPushState.apply(history, args);
          setTimeout(() => this.updateActiveItemFromPath(), 0);
        };
        history.replaceState = (...args) => {
          originalReplaceState.apply(history, args);
          setTimeout(() => this.updateActiveItemFromPath(), 0);
        };
      }
      /**
       * NEW: Get active item based on current path
       */
      getActiveItemFromPath() {
        const path = window.location.pathname;
        const item = this.config.items.find((item2) => item2.href === path);
        return item ? item.id : "home";
      }
      /**
       * NEW: Update active item when route changes
       */
      updateActiveItemFromPath() {
        const activeItem = this.getActiveItemFromPath();
        if (this.state.activeItem !== activeItem) {
          this.setState({ activeItem });
        }
      }
      updateAuthState(isAuthenticated) {
        this.isAuthenticated = isAuthenticated;
        console.log(`🔐 Navigation auth state updated: ${isAuthenticated ? "authenticated" : "not authenticated"}`);
        console.log("🔐 All navigation items remain enabled");
      }
      setupEventListeners() {
        this.keyboardHandler = (e) => {
          if (!this.config.enableKeyboard)
            return;
          switch (e.key) {
            case "Escape":
              if (this.state.isOpen) {
                this.close();
                e.preventDefault();
              }
              break;
            case "Tab":
              this.setState({ keyboardMode: true });
              break;
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowLeft":
            case "ArrowRight":
              if (this.state.isOpen) {
                this.handleKeyboardNavigation(e.key);
                e.preventDefault();
              }
              break;
            case "Enter":
            case " ":
              if (this.state.focusedItem && this.state.isOpen) {
                this.navigate(this.state.focusedItem);
                e.preventDefault();
              }
              break;
          }
        };
        this.mouseHandler = (e) => {
          if (this.state.keyboardMode) {
            this.setState({ keyboardMode: false });
          }
        };
        this.touchHandler = (e) => {
          if (!this.config.enableTouch)
            return;
        };
        document.addEventListener("keydown", this.keyboardHandler);
        document.addEventListener("mousedown", this.mouseHandler);
        document.addEventListener("touchstart", this.touchHandler, { passive: true });
      }
      handleKeyboardNavigation(key) {
        const currentIndex = this.config.items.findIndex((item) => item.id === this.state.focusedItem);
        let newIndex = currentIndex;
        switch (key) {
          case "ArrowUp":
          case "ArrowLeft":
            newIndex = currentIndex > 0 ? currentIndex - 1 : this.config.items.length - 1;
            break;
          case "ArrowDown":
          case "ArrowRight":
            newIndex = currentIndex < this.config.items.length - 1 ? currentIndex + 1 : 0;
            break;
        }
        const newItem = this.config.items[newIndex];
        if (newItem) {
          this.setState({ focusedItem: newItem.id });
        }
      }
      setElement(element) {
        this.element = element;
        if (this.resizeObserver) {
          this.resizeObserver.disconnect();
        }
        this.resizeObserver = new ResizeObserver(() => {
          this.updateLayout();
        });
        this.resizeObserver.observe(element);
      }
      updateLayout() {
      }
      open() {
        var _a;
        if (this.state.isOpen || this.state.isAnimating)
          return;
        this.setState({
          isOpen: true,
          isAnimating: true,
          focusedItem: ((_a = this.config.items[0]) == null ? void 0 : _a.id) || null
        });
        setTimeout(() => {
          this.setState({ isAnimating: false });
        }, this.config.animationDuration);
        this.emitEvent("open", null);
      }
      close() {
        if (!this.state.isOpen || this.state.isAnimating)
          return;
        this.setState({
          isOpen: false,
          isAnimating: true,
          hoveredItem: null,
          focusedItem: null
        });
        setTimeout(() => {
          this.setState({ isAnimating: false });
        }, this.config.animationDuration);
        this.emitEvent("close", null);
      }
      toggle() {
        if (this.state.isOpen) {
          this.close();
        } else {
          this.open();
        }
      }
      /**
       * UPDATED: Handle both auth checking and router navigation
       */
      navigate(itemId) {
        const item = this.config.items.find((i) => i.id === itemId);
        if (!item) {
          console.warn(`Navigation item "${itemId}" not found`);
          return;
        }
        if (item.requiresAuth && !this.isAuthenticated) {
          console.log(`🔒 "${itemId}" requires authentication - showing login prompt`);
          this.emitEvent("auth-required", item);
          this.showAuthPrompt(item);
          return;
        }
        if (item.external) {
          window.open(item.href, "_blank", "noopener,noreferrer");
        } else {
          this.navigateToRoute(item.href);
        }
        if (this.config.autoClose) {
          setTimeout(() => {
            this.close();
          }, this.config.closeDelay);
        }
        this.emitEvent("navigate", item);
      }
      /**
       * NEW: Navigate to route using React Router
       */
      navigateToRoute(path) {
        if (window.location.pathname === path) {
          return;
        }
        window.history.pushState(null, "", path);
        window.dispatchEvent(new PopStateEvent("popstate"));
        console.log(`🌐 Navigated to: ${path}`);
      }
      /**
       * Enhanced auth prompt with route information
       */
      showAuthPrompt(item) {
        const existingModal = document.getElementById("auth-prompt-modal");
        if (existingModal) {
          existingModal.remove();
        }
        const modal = document.createElement("div");
        modal.id = "auth-prompt-modal";
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(4px);
        `;
        const modalContent = document.createElement("div");
        modalContent.style.cssText = `
            background: var(--gd-surface-raised, white);
            border-radius: var(--gd-radius-2xl, 16px);
            padding: var(--gd-space-8, 2rem);
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: var(--gd-shadow-2xl, 0 25px 50px -12px rgba(0, 0, 0, 0.25));
            border: 1px solid var(--gd-border-light, #e5e7eb);
        `;
        modalContent.innerHTML = `
            <h3 style="margin: 0 0 1rem 0; color: var(--gd-text-primary, #000); font-size: var(--gd-font-size-xl, 1.25rem);">
                Sign in to access ${item.label}
            </h3>
            <p style="margin: 0 0 1.5rem 0; color: var(--gd-text-secondary, #666); font-size: var(--gd-font-size-base, 1rem);">
                Please sign in with Google to continue to ${item.label.toLowerCase()}.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="google-signin-btn" style="
                    background: #4285f4;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: var(--gd-radius-lg, 8px);
                    font-size: var(--gd-font-size-base, 1rem);
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: background 0.2s;
                ">
                    🔐 Sign in with Google
                </button>
                <button id="cancel-btn" style="
                    background: var(--gd-bg-secondary, #f3f4f6);
                    color: var(--gd-text-primary, #000);
                    border: 1px solid var(--gd-border-light, #e5e7eb);
                    padding: 0.75rem 1.5rem;
                    border-radius: var(--gd-radius-lg, 8px);
                    font-size: var(--gd-font-size-base, 1rem);
                    cursor: pointer;
                    transition: background 0.2s;
                ">
                    Cancel
                </button>
            </div>
        `;
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        const googleBtn = modal.querySelector("#google-signin-btn");
        const cancelBtn = modal.querySelector("#cancel-btn");
        googleBtn == null ? void 0 : googleBtn.addEventListener("click", () => {
          this.emitEvent("google-signin-requested", item);
          modal.remove();
        });
        cancelBtn == null ? void 0 : cancelBtn.addEventListener("click", () => {
          modal.remove();
        });
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            modal.remove();
          }
        });
        const handleEscape = (e) => {
          if (e.key === "Escape") {
            modal.remove();
            document.removeEventListener("keydown", handleEscape);
          }
        };
        document.addEventListener("keydown", handleEscape);
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
              mutation.removedNodes.forEach((node) => {
                if (node === modal) {
                  document.removeEventListener("keydown", handleEscape);
                  observer.disconnect();
                }
              });
            }
          });
        });
        observer.observe(document.body, { childList: true });
      }
      setHoveredItem(itemId) {
        if (this.state.hoveredItem !== itemId) {
          this.setState({ hoveredItem: itemId });
          if (itemId) {
            const item = this.config.items.find((i) => i.id === itemId);
            this.emitEvent("hover", item || null);
          }
        }
      }
      getItemPosition(position) {
        const angle = (position * (360 / this.config.items.length) - 90) * (Math.PI / 180);
        const x = Math.cos(angle) * this.config.radius;
        const y = Math.sin(angle) * this.config.radius;
        return { x, y };
      }
      getState() {
        return __spreadValues({}, this.state);
      }
      getConfig() {
        return __spreadValues({}, this.config);
      }
      updateConfig(newConfig) {
        const _a = newConfig, { items } = _a, safeConfig = __objRest(_a, ["items"]);
        if (items) {
          console.warn("Navigation items cannot be updated via updateConfig. Use updateAuthState() for auth-related changes.");
        }
        this.config = __spreadValues(__spreadValues({}, this.config), safeConfig);
        this.emitEvent("config-updated", null);
        this.notifySubscribers();
      }
      subscribe(callback) {
        this.subscribers.add(callback);
        return () => {
          this.subscribers.delete(callback);
        };
      }
      setState(newState) {
        this.state = __spreadValues(__spreadValues({}, this.state), newState);
        this.notifySubscribers();
      }
      notifySubscribers() {
        this.subscribers.forEach((callback) => {
          try {
            callback(this.state);
          } catch (error) {
            console.error("Error in navigation subscriber:", error);
          }
        });
      }
      emitEvent(type, item) {
        const event = new CustomEvent(`navigation:${type}`, {
          detail: { item, state: this.state },
          bubbles: true
        });
        document.dispatchEvent(event);
      }
      destroy() {
        if (this.keyboardHandler) {
          document.removeEventListener("keydown", this.keyboardHandler);
        }
        if (this.mouseHandler) {
          document.removeEventListener("mousedown", this.mouseHandler);
        }
        if (this.touchHandler) {
          document.removeEventListener("touchstart", this.touchHandler);
        }
        if (this.resizeObserver) {
          this.resizeObserver.disconnect();
        }
        const existingModal = document.getElementById("auth-prompt-modal");
        if (existingModal) {
          existingModal.remove();
        }
        this.subscribers.clear();
        _NavigationManager.instance = null;
        this.isInitialized = false;
        console.log("🧹 NavigationManager destroyed");
      }
    };
    __publicField(_NavigationManager, "instance", null);
    let NavigationManager = _NavigationManager;
    const config = {
      supabase: {
        url: "https://syxygcrxrldnhlcnpbyr.supabase.co",
        anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5eHlnY3J4cmxkbmhsY25wYnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1ODU3NDMsImV4cCI6MjA3MTE2MTc0M30.21zINCjjS_O5bSdR5EMRhmUHum6yStGwCe_haGUgYeo",
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: "pkce",
          redirectTo: "http://localhost:3000/auth/callback"
        }
      },
      app: {
        name: "Health Tracker",
        version: "1.0.0-dev",
        baseUrl: "http://localhost:3000",
        domain: "localhost:3000"
      },
      api: {
        timeout: 1e4,
        retries: 3
      },
      // Feature flags
      features: {
        enableGoogleAuth: true,
        enableEmailAuth: true,
        enableProfilePictures: true,
        enableNotifications: true
      },
      // UI Configuration
      ui: {
        theme: "light",
        language: "en",
        dateFormat: "YYYY-MM-DD",
        timeFormat: "24h"
      }
    };
    class SupabaseService {
      constructor() {
        __publicField(this, "client");
        this.client = createClient(
          config.supabase.url,
          config.supabase.anonKey,
          {
            auth: __spreadProps(__spreadValues({}, config.supabase.auth), {
              flowType: "pkce",
              autoRefreshToken: true,
              persistSession: true,
              detectSessionInUrl: true
            })
          }
        );
        console.log("SupabaseService initialized");
        console.log("URL:", config.supabase.url);
        console.log("Redirect URL will be:", config.supabase.auth.redirectTo);
      }
      // ===== GOOGLE OAUTH WITH POPUP ===== //
      signInWithGoogle() {
        return __async(this, null, function* () {
          try {
            console.log("Initiating Google OAuth...");
            const { data, error } = yield this.client.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                  access_type: "offline",
                  prompt: "consent"
                },
                scopes: "openid email profile"
              }
            });
            if (error) {
              console.error("Google OAuth error:", error);
              return { data, error };
            }
            console.log("Google OAuth initiated successfully");
            return { data, error };
          } catch (err) {
            console.error("Google sign-in failed:", err);
            const error = err;
            return { data: null, error };
          }
        });
      }
      // ===== GOOGLE OAUTH WITH POPUP (Safe implementation) ===== //
      signInWithGooglePopup() {
        return __async(this, null, function* () {
          try {
            console.log("Initiating Google OAuth via popup...");
            const { data, error } = yield this.client.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                  access_type: "offline",
                  prompt: "consent"
                },
                scopes: "openid email profile"
              }
            });
            if (error) {
              console.error("Google OAuth popup error:", error);
              return { data, error };
            }
            console.log("Google OAuth popup initiated successfully");
            return { data, error };
          } catch (err) {
            console.error("Google popup sign-in failed:", err);
            const error = err;
            return { data: null, error };
          }
        });
      }
      // ===== POPUP CALLBACK HANDLER ===== //
      handlePopupCallback() {
        return __async(this, null, function* () {
          try {
            yield new Promise((resolve) => setTimeout(resolve, 1e3));
            const { data, error } = yield this.client.auth.getSession();
            if (error) {
              return { data: null, error };
            }
            if (data.session) {
              return { data: data.session, error: null };
            }
            return {
              data: null,
              error: {
                message: "No session found after authentication",
                name: "NoSession",
                status: 401
              }
            };
          } catch (err) {
            console.error("Popup callback handling failed:", err);
            const error = err;
            return { data: null, error };
          }
        });
      }
      // ===== EMAIL/PASSWORD AUTHENTICATION ===== //
      signInWithEmail(email, password, rememberMe = false) {
        return __async(this, null, function* () {
          try {
            const { data, error } = yield this.client.auth.signInWithPassword({
              email,
              password
            });
            if (!error && data.session && rememberMe) {
              try {
                yield this.extendSessionDuration(data.session);
              } catch (extendError) {
                console.warn("Failed to extend session duration:", extendError);
              }
            }
            return { data, error };
          } catch (err) {
            console.error("Email sign-in failed:", err);
            const error = err;
            return { data: null, error };
          }
        });
      }
      signUpWithEmail(email, password) {
        return __async(this, null, function* () {
          try {
            const { data, error } = yield this.client.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: config.supabase.auth.redirectTo,
                data: {
                  email_verify: true
                }
              }
            });
            return { data, error };
          } catch (err) {
            console.error("Email sign-up failed:", err);
            const error = err;
            return { data: null, error };
          }
        });
      }
      // ===== SESSION MANAGEMENT ===== //
      signOut() {
        return __async(this, null, function* () {
          try {
            this.clearExtendedSession();
            const { error } = yield this.client.auth.signOut();
            if (error) {
              console.error("Sign out error:", error);
            } else {
              console.log("Signed out successfully");
            }
            return { error };
          } catch (err) {
            console.error("Sign out failed:", err);
            const error = err;
            return { error };
          }
        });
      }
      getSession() {
        return __async(this, null, function* () {
          try {
            const { data: { session }, error } = yield this.client.auth.getSession();
            return { session, error };
          } catch (err) {
            console.error("Get session failed:", err);
            const error = err;
            return { session: null, error };
          }
        });
      }
      getUser() {
        return __async(this, null, function* () {
          try {
            const { data: { user }, error } = yield this.client.auth.getUser();
            return { user, error };
          } catch (err) {
            console.error("Get user failed:", err);
            const error = err;
            return { user: null, error };
          }
        });
      }
      refreshSession() {
        return __async(this, null, function* () {
          try {
            const { data: { session }, error } = yield this.client.auth.refreshSession();
            return { session, error };
          } catch (err) {
            console.error("Refresh session failed:", err);
            const error = err;
            return { session: null, error };
          }
        });
      }
      extendSessionDuration(session) {
        return __async(this, null, function* () {
          try {
            const extendedExpiry = /* @__PURE__ */ new Date();
            extendedExpiry.setDate(extendedExpiry.getDate() + 30);
            localStorage.setItem("extended_session", JSON.stringify({
              expiry: extendedExpiry.toISOString(),
              userId: session.user.id
            }));
          } catch (error) {
            console.warn("Failed to set extended session:", error);
          }
        });
      }
      // ===== PASSWORD RESET ===== //
      resetPassword(email) {
        return __async(this, null, function* () {
          try {
            const { data, error } = yield this.client.auth.resetPasswordForEmail(email, {
              redirectTo: `${config.app.baseUrl}/auth/reset-password`
            });
            return { data, error };
          } catch (err) {
            console.error("Password reset failed:", err);
            const error = err;
            return { data: null, error };
          }
        });
      }
      updatePassword(newPassword) {
        return __async(this, null, function* () {
          try {
            const { data, error } = yield this.client.auth.updateUser({
              password: newPassword
            });
            return { data, error };
          } catch (err) {
            console.error("Password update failed:", err);
            const error = err;
            return { data: null, error };
          }
        });
      }
      // ===== EMAIL VERIFICATION ===== //
      resendEmailVerification(email) {
        return __async(this, null, function* () {
          try {
            const { data, error } = yield this.client.auth.resend({
              type: "signup",
              email,
              options: {
                emailRedirectTo: config.supabase.auth.redirectTo
              }
            });
            return { data, error };
          } catch (err) {
            console.error("Email verification resend failed:", err);
            const error = err;
            return { data: null, error };
          }
        });
      }
      // ===== AUTH STATE LISTENER ===== //
      onAuthStateChange(callback) {
        const { data: { subscription } } = this.client.auth.onAuthStateChange((event, session) => {
          var _a;
          console.log("Auth state changed:", event, ((_a = session == null ? void 0 : session.user) == null ? void 0 : _a.email) || "No user");
          callback(event, session);
        });
        return () => {
          subscription.unsubscribe();
        };
      }
      // ===== USER REGISTRATION ===== //
      registerUser(user) {
        return __async(this, null, function* () {
          var _a, _b, _c, _d, _e;
          try {
            console.log("Starting user registration for:", user.email);
            const { data: existingProfile, error: checkError } = yield this.client.from("user_profiles").select("id").eq("user_id", user.id).single();
            if (checkError && checkError.code !== "PGRST116") {
              console.error("Error checking existing profile:", checkError);
              return { success: false, error: "Failed to check existing user profile" };
            }
            if (existingProfile) {
              console.log("User profile already exists, skipping registration");
              return { success: true };
            }
            const profileData = {
              user_id: user.id,
              full_name: ((_a = user.user_metadata) == null ? void 0 : _a.full_name) || ((_b = user.user_metadata) == null ? void 0 : _b.name) || ((_c = user.email) == null ? void 0 : _c.split("@")[0]),
              avatar_url: ((_d = user.user_metadata) == null ? void 0 : _d.avatar_url) || ((_e = user.user_metadata) == null ? void 0 : _e.picture)
            };
            const { error: profileError } = yield this.client.from("user_profiles").insert([profileData]);
            if (profileError) {
              console.error("Failed to create user profile:", profileError);
              return { success: false, error: "Failed to create user profile" };
            }
            const { data: existingRole, error: roleCheckError } = yield this.client.from("user_roles").select("id").eq("user_id", user.id).single();
            if (roleCheckError && roleCheckError.code !== "PGRST116") {
              console.error("Error checking existing role:", roleCheckError);
              return { success: false, error: "Failed to check existing user role" };
            }
            if (!existingRole) {
              const { error: roleError } = yield this.client.from("user_roles").insert([{
                user_id: user.id,
                role: "user"
              }]);
              if (roleError) {
                console.error("Failed to create user role:", roleError);
                return { success: false, error: "Failed to create user role" };
              }
            }
            console.log("User registration completed successfully");
            return { success: true };
          } catch (error) {
            console.error("User registration failed:", error);
            return { success: false, error: "Unexpected error during user registration" };
          }
        });
      }
      // ===== ADMIN ROLE CHECK ===== //
      isAdmin(userId) {
        return __async(this, null, function* () {
          try {
            const { data, error } = yield this.client.from("user_roles").select("role").eq("user_id", userId).maybeSingle();
            if (error) {
              console.warn("Admin check error:", error);
              return false;
            }
            return (data == null ? void 0 : data.role) === "admin";
          } catch (error) {
            console.warn("Failed to check admin status:", error);
            return false;
          }
        });
      }
      // ===== USER PROFILE MANAGEMENT ===== //
      getUserProfile(userId) {
        return __async(this, null, function* () {
          try {
            const { data, error } = yield this.client.from("user_profiles").select("*").eq("user_id", userId).single();
            return { data, error };
          } catch (err) {
            console.error("Get user profile failed:", err);
            return { data: null, error: err };
          }
        });
      }
      updateUserProfile(userId, updates) {
        return __async(this, null, function* () {
          try {
            const { data: existingProfile } = yield this.client.from("user_profiles").select("id").eq("user_id", userId).single();
            if (existingProfile) {
              const { data, error } = yield this.client.from("user_profiles").update(__spreadProps(__spreadValues({}, updates), {
                updated_at: (/* @__PURE__ */ new Date()).toISOString()
              })).eq("user_id", userId).select().single();
              return { data, error };
            } else {
              const { data, error } = yield this.client.from("user_profiles").insert(__spreadProps(__spreadValues({
                user_id: userId
              }, updates), {
                updated_at: (/* @__PURE__ */ new Date()).toISOString()
              })).select().single();
              return { data, error };
            }
          } catch (err) {
            console.error("Profile update failed:", err);
            return { data: null, error: err };
          }
        });
      }
      updateUserMetadata(updates) {
        return __async(this, null, function* () {
          try {
            const { data, error } = yield this.client.auth.updateUser({
              data: updates
            });
            return { data, error };
          } catch (err) {
            console.error("User metadata update failed:", err);
            const error = err;
            return { data: null, error };
          }
        });
      }
      // ===== UTILITY METHODS ===== //
      getClient() {
        return this.client;
      }
      checkEmailExists(email) {
        return __async(this, null, function* () {
          try {
            const { data, error } = yield this.client.rpc("check_email_exists", {
              email_input: email
            });
            return !error && !!data;
          } catch (error) {
            console.warn("Failed to check email existence:", error);
            return false;
          }
        });
      }
      // ===== SESSION HELPERS ===== //
      isSessionValid(session) {
        if (!session)
          return false;
        const now = (/* @__PURE__ */ new Date()).getTime() / 1e3;
        return session.expires_at ? session.expires_at > now : false;
      }
      shouldRefreshSession(session) {
        if (!session || !session.expires_at)
          return false;
        const now = (/* @__PURE__ */ new Date()).getTime() / 1e3;
        const timeUntilExpiry = session.expires_at - now;
        return timeUntilExpiry < 300;
      }
      getExtendedSessionInfo() {
        try {
          const stored = localStorage.getItem("extended_session");
          if (!stored)
            return { isExtended: false, expiry: null };
          const parsed = JSON.parse(stored);
          const expiry = new Date(parsed.expiry);
          const isExtended = expiry > /* @__PURE__ */ new Date();
          return { isExtended, expiry: isExtended ? expiry : null };
        } catch (error) {
          console.warn("Failed to get extended session info:", error);
          return { isExtended: false, expiry: null };
        }
      }
      clearExtendedSession() {
        try {
          localStorage.removeItem("extended_session");
        } catch (error) {
          console.warn("Failed to clear extended session:", error);
        }
      }
      // ===== ORIENTATION MANAGEMENT ===== //
      getOrientations(applicableFor) {
        return __async(this, null, function* () {
          try {
            let query = this.client.from("orientations").select("*").order("label", { ascending: true });
            if (applicableFor && applicableFor !== "both") {
              query = query.or(`applicable_for.eq.${applicableFor},applicable_for.eq.both`);
            }
            const { data, error } = yield query;
            return { data: data || [], error };
          } catch (err) {
            console.error("Get orientations failed:", err);
            return { data: [], error: err };
          }
        });
      }
      // ===== MEALS MANAGEMENT ===== //
      getTodaysMeals(userId) {
        return __async(this, null, function* () {
          try {
            const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
            const { data, error } = yield this.client.from("meals").select("*").eq("user_id", userId).eq("date", today).order("time", { ascending: true });
            return { data: data || [], error };
          } catch (err) {
            console.error("Get today's meals failed:", err);
            return { data: [], error: err };
          }
        });
      }
      getMealsByDateRange(userId, startDate, endDate) {
        return __async(this, null, function* () {
          try {
            const { data, error } = yield this.client.from("meals").select("*").eq("user_id", userId).gte("date", startDate).lte("date", endDate).order("date", { ascending: false }).order("time", { ascending: true });
            return { data: data || [], error };
          } catch (err) {
            console.error("Get meals by date range failed:", err);
            return { data: [], error: err };
          }
        });
      }
      addMeal(mealData) {
        return __async(this, null, function* () {
          try {
            const { data, error } = yield this.client.from("meals").insert([mealData]).select().single();
            return { data, error };
          } catch (err) {
            console.error("Add meal failed:", err);
            return { data: null, error: err };
          }
        });
      }
      updateMeal(mealId, updates) {
        return __async(this, null, function* () {
          try {
            const { data, error } = yield this.client.from("meals").update(__spreadProps(__spreadValues({}, updates), {
              updated_at: (/* @__PURE__ */ new Date()).toISOString()
            })).eq("id", mealId).select().single();
            return { data, error };
          } catch (err) {
            console.error("Update meal failed:", err);
            return { data: null, error: err };
          }
        });
      }
      deleteMeal(mealId) {
        return __async(this, null, function* () {
          try {
            const { error } = yield this.client.from("meals").delete().eq("id", mealId);
            return { error };
          } catch (err) {
            console.error("Delete meal failed:", err);
            return { error: err };
          }
        });
      }
      // ===== CUSTOM MEALS MANAGEMENT ===== //
      checkCustomMealExists(userId, mealName, calories, protein, carbs, fat) {
        return __async(this, null, function* () {
          try {
            const { data, error } = yield this.client.from("custom_meals").select("id").eq("submitted_by", userId).eq("name", mealName).eq("calories_per_100g", calories).eq("protein_g", protein).eq("carbohydrates_g", carbs).eq("fats_g", fat).maybeSingle();
            return { exists: !!data, error };
          } catch (err) {
            console.error("Check custom meal exists failed:", err);
            return { exists: false, error: err };
          }
        });
      }
      addCustomMeal(customMealData) {
        return __async(this, null, function* () {
          try {
            const { data, error } = yield this.client.from("custom_meals").insert([customMealData]).select().single();
            return { data, error };
          } catch (err) {
            console.error("Add custom meal failed:", err);
            return { data: null, error: err };
          }
        });
      }
      // ===== FOOD SEARCH FUNCTIONALITY ===== //
      searchFoods(query, limit = 5) {
        return __async(this, null, function* () {
          try {
            const { data, error } = yield this.client.from("foods").select("id, name, calories_per_100g, protein_g, carbohydrates_g, fats_g, fiber_g, free_sugar_g, sodium_mg").ilike("name", `%${query}%`).limit(limit).order("name", { ascending: true });
            return { data: data || [], error };
          } catch (err) {
            console.error("Search foods failed:", err);
            return { data: [], error: err };
          }
        });
      }
      searchCustomMeals(userId, query, limit = 5) {
        return __async(this, null, function* () {
          try {
            const { data, error } = yield this.client.from("custom_meals").select("id, name, calories_per_100g, protein_g, carbohydrates_g, fats_g, fiber_g, free_sugar_g, sodium_mg").eq("submitted_by", userId).eq("status", "approved").ilike("name", `%${query}%`).limit(limit).order("name", { ascending: true });
            return { data: data || [], error };
          } catch (err) {
            console.error("Search custom meals failed:", err);
            return { data: [], error: err };
          }
        });
      }
      searchFoodsAndCustomMeals(userId, query, limit = 5) {
        return __async(this, null, function* () {
          try {
            const [foodsResult, customMealsResult] = yield Promise.all([
              this.searchFoods(query, Math.ceil(limit / 2)),
              this.searchCustomMeals(userId, query, Math.ceil(limit / 2))
            ]);
            if (foodsResult.error && customMealsResult.error) {
              return { data: [], error: foodsResult.error };
            }
            const combinedResults = [
              ...(foodsResult.data || []).map((food) => __spreadProps(__spreadValues({}, food), { source: "foods" })),
              ...(customMealsResult.data || []).map((meal) => __spreadProps(__spreadValues({}, meal), { source: "custom_meals" }))
            ];
            const sortedResults = combinedResults.sort((a, b) => a.name.localeCompare(b.name)).slice(0, limit);
            return { data: sortedResults, error: null };
          } catch (err) {
            console.error("Search foods and custom meals failed:", err);
            return { data: [], error: err };
          }
        });
      }
      // ===== OAUTH CALLBACK HANDLER ===== //
      handleOAuthCallback() {
        return __async(this, null, function* () {
          try {
            const { data, error } = yield this.client.auth.getSession();
            if (error) {
              console.error("OAuth callback error:", error);
              return { success: false, error: error.message };
            }
            if (data.session) {
              console.log("OAuth callback successful, user signed in:", data.session.user.email);
              if (window.opener && window.opener !== window) {
                window.opener.postMessage({
                  type: "SUPABASE_AUTH_SUCCESS",
                  session: data.session
                }, window.location.origin);
                window.close();
              }
              return { success: true };
            } else {
              if (window.opener && window.opener !== window) {
                window.opener.postMessage({
                  type: "SUPABASE_AUTH_ERROR",
                  error: { message: "No session found after OAuth callback" }
                }, window.location.origin);
                window.close();
              }
              return { success: false, error: "No session found after OAuth callback" };
            }
          } catch (err) {
            console.error("OAuth callback handling failed:", err);
            if (window.opener && window.opener !== window) {
              window.opener.postMessage({
                type: "SUPABASE_AUTH_ERROR",
                error: { message: "Failed to handle OAuth callback" }
              }, window.location.origin);
              window.close();
            }
            return { success: false, error: "Failed to handle OAuth callback" };
          }
        });
      }
    }
    const SupabaseService$1 = new SupabaseService();
    const _NotificationManager = class _NotificationManager {
      constructor() {
        __publicField(this, "notifications", []);
        __publicField(this, "subscribers", /* @__PURE__ */ new Set());
        __publicField(this, "nextId", 1);
      }
      static getInstance() {
        if (!_NotificationManager.instance) {
          _NotificationManager.instance = new _NotificationManager();
        }
        return _NotificationManager.instance;
      }
      show(message, type = "info", duration = 5e3) {
        const notification = {
          id: `notification-${this.nextId++}`,
          message,
          type,
          duration,
          timestamp: Date.now()
        };
        this.notifications.push(notification);
        this.notify();
        if (duration > 0) {
          setTimeout(() => {
            this.remove(notification.id);
          }, duration);
        }
        return notification.id;
      }
      remove(id) {
        this.notifications = this.notifications.filter((n) => n.id !== id);
        this.notify();
      }
      clear() {
        this.notifications = [];
        this.notify();
      }
      subscribe(callback) {
        this.subscribers.add(callback);
        callback(this.notifications);
        return () => this.subscribers.delete(callback);
      }
      notify() {
        this.subscribers.forEach((callback) => callback([...this.notifications]));
      }
      // Helper methods
      success(message, duration = 5e3) {
        return this.show(message, "success", duration);
      }
      error(message, duration = 8e3) {
        return this.show(message, "error", duration);
      }
      info(message, duration = 5e3) {
        return this.show(message, "info", duration);
      }
      warning(message, duration = 6e3) {
        return this.show(message, "warning", duration);
      }
    };
    __publicField(_NotificationManager, "instance");
    let NotificationManager = _NotificationManager;
    const useAuth = () => {
      const mountedRef = reactExports.useRef(true);
      const notificationManagerRef = reactExports.useRef(NotificationManager.getInstance());
      const checkProfileSetupAndRedirect = (userId) => __async(exports, null, function* () {
        try {
          const { data: profile } = yield SupabaseService$1.getUserProfile(userId);
          const isSetupIncomplete = !profile || !profile.height_cm || !profile.weight_kg || !profile.activity_level;
          if (isSetupIncomplete) {
            if (window.location.pathname !== "/profile") {
              setTimeout(() => {
                window.location.href = "/profile";
              }, 1e3);
            }
          }
        } catch (error) {
          console.error("Error checking profile setup:", error);
          if (window.location.pathname !== "/profile") {
            setTimeout(() => {
              window.location.href = "/profile";
            }, 1e3);
          }
        }
      });
      const [authState, setAuthState] = reactExports.useState({
        user: null,
        session: null,
        loading: true,
        isAuthenticated: false,
        isAdmin: false,
        authLoading: false
      });
      reactExports.useEffect(() => {
        mountedRef.current = true;
        const initializeAuth = () => __async(exports, null, function* () {
          try {
            const { session, error } = yield SupabaseService$1.getSession();
            if (mountedRef.current) {
              if (session == null ? void 0 : session.user) {
                const adminStatus = yield SupabaseService$1.isAdmin(session.user.id);
                setAuthState({
                  user: session.user,
                  session,
                  loading: false,
                  isAuthenticated: true,
                  isAdmin: adminStatus,
                  authLoading: false
                });
              } else {
                setAuthState({
                  user: null,
                  session: null,
                  loading: false,
                  isAuthenticated: false,
                  isAdmin: false,
                  authLoading: false
                });
              }
            }
          } catch (error) {
            console.error("Auth initialization error:", error);
            if (mountedRef.current) {
              setAuthState({
                user: null,
                session: null,
                loading: false,
                isAuthenticated: false,
                isAdmin: false,
                authLoading: false
              });
            }
          }
        });
        initializeAuth();
        return () => {
          mountedRef.current = false;
        };
      }, []);
      reactExports.useEffect(() => {
        const unsubscribe = SupabaseService$1.onAuthStateChange(
          (event, session) => __async(exports, null, function* () {
            var _a, _b, _c, _d;
            if (!mountedRef.current)
              return;
            console.log("Auth state change:", event);
            if (session == null ? void 0 : session.user) {
              const adminStatus = yield SupabaseService$1.isAdmin(session.user.id);
              if (mountedRef.current) {
                setAuthState({
                  user: session.user,
                  session,
                  loading: false,
                  isAuthenticated: true,
                  isAdmin: adminStatus,
                  authLoading: false
                  // Clear auth loading on successful sign in
                });
                if (event === "SIGNED_IN") {
                  const userName = ((_a = session.user.user_metadata) == null ? void 0 : _a.full_name) || ((_b = session.user.user_metadata) == null ? void 0 : _b.name) || ((_c = session.user.email) == null ? void 0 : _c.split("@")[0]) || "User";
                  const provider = (_d = session.user.app_metadata) == null ? void 0 : _d.provider;
                  if (provider === "google") {
                    notificationManagerRef.current.show(
                      `Welcome back, ${userName}!`,
                      "success",
                      3e3
                    );
                  }
                  checkProfileSetupAndRedirect(session.user.id);
                }
              }
            } else {
              if (mountedRef.current) {
                setAuthState({
                  user: null,
                  session: null,
                  loading: false,
                  isAuthenticated: false,
                  isAdmin: false,
                  authLoading: false
                });
                if (event === "SIGNED_OUT") {
                  notificationManagerRef.current.show(
                    "You have been signed out",
                    "info",
                    2e3
                  );
                }
              }
            }
          })
        );
        return unsubscribe;
      }, []);
      const signInWithGoogle = reactExports.useCallback(() => __async(exports, null, function* () {
        try {
          console.log("Starting Google OAuth popup sign in...");
          if (mountedRef.current) {
            setAuthState((prevState) => __spreadProps(__spreadValues({}, prevState), {
              authLoading: true
            }));
          }
          const { data, error } = yield SupabaseService$1.signInWithGooglePopup();
          if (error) {
            console.error("Google OAuth popup error:", error);
            if (mountedRef.current) {
              setAuthState((prevState) => __spreadProps(__spreadValues({}, prevState), {
                authLoading: false
              }));
            }
            notificationManagerRef.current.show(
              error.message || "Google sign in failed",
              "error",
              5e3
            );
            return { success: false, error };
          }
          if (data) {
            console.log("Google OAuth popup initiated successfully");
            return { success: true, data };
          }
          if (mountedRef.current) {
            setAuthState((prevState) => __spreadProps(__spreadValues({}, prevState), {
              authLoading: false
            }));
          }
          return { success: false, error: { message: "Authentication was cancelled" } };
        } catch (error) {
          console.error("Google popup sign in error:", error);
          if (mountedRef.current) {
            setAuthState((prevState) => __spreadProps(__spreadValues({}, prevState), {
              authLoading: false
            }));
          }
          const errorMessage = (error == null ? void 0 : error.message) || "Google sign in failed";
          notificationManagerRef.current.show(errorMessage, "error", 5e3);
          return { success: false, error: { message: errorMessage } };
        }
      }), []);
      const signInWithEmail = reactExports.useCallback((email, password, rememberMe = false) => __async(exports, null, function* () {
        try {
          const { data, error } = yield SupabaseService$1.signInWithEmail(email, password, rememberMe);
          if (error) {
            notificationManagerRef.current.show(
              error.message || "Sign in failed",
              "error",
              5e3
            );
            return { success: false, error };
          }
          return { success: true, data };
        } catch (error) {
          console.error("Email sign in error:", error);
          const errorMessage = (error == null ? void 0 : error.message) || "Sign in failed";
          notificationManagerRef.current.show(errorMessage, "error", 5e3);
          return { success: false, error: { message: errorMessage } };
        }
      }), []);
      const signUpWithEmail = reactExports.useCallback((email, password) => __async(exports, null, function* () {
        try {
          const { data, error } = yield SupabaseService$1.signUpWithEmail(email, password);
          if (error) {
            notificationManagerRef.current.show(
              error.message || "Sign up failed",
              "error",
              5e3
            );
            return { success: false, error };
          }
          notificationManagerRef.current.show(
            "Account created! Please check your email to verify.",
            "success",
            7e3
          );
          return { success: true, data };
        } catch (error) {
          console.error("Email sign up error:", error);
          const errorMessage = (error == null ? void 0 : error.message) || "Sign up failed";
          notificationManagerRef.current.show(errorMessage, "error", 5e3);
          return { success: false, error: { message: errorMessage } };
        }
      }), []);
      const signOut = reactExports.useCallback(() => __async(exports, null, function* () {
        try {
          const { error } = yield SupabaseService$1.signOut();
          if (error) {
            notificationManagerRef.current.show(
              error.message || "Sign out failed",
              "error",
              5e3
            );
            return { success: false, error };
          }
          return { success: true };
        } catch (error) {
          console.error("Sign out error:", error);
          const errorMessage = (error == null ? void 0 : error.message) || "Sign out failed";
          notificationManagerRef.current.show(errorMessage, "error", 5e3);
          return { success: false, error: { message: errorMessage } };
        }
      }), []);
      const handleOAuthCallback = reactExports.useCallback(() => __async(exports, null, function* () {
        try {
          console.log("Handling OAuth callback...");
          const result = yield SupabaseService$1.handleOAuthCallback();
          if (result.success) {
            notificationManagerRef.current.show(
              "Successfully signed in with Google!",
              "success",
              3e3
            );
          } else {
            notificationManagerRef.current.show(
              result.error || "OAuth authentication failed",
              "error",
              5e3
            );
          }
          return result;
        } catch (error) {
          console.error("OAuth callback error:", error);
          const errorMessage = (error == null ? void 0 : error.message) || "OAuth callback failed";
          notificationManagerRef.current.show(errorMessage, "error", 5e3);
          return { success: false, error: errorMessage };
        }
      }), []);
      return __spreadProps(__spreadValues({}, authState), {
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        handleOAuthCallback
      });
    };
    const prefersReducedMotion = () => {
      if (typeof window === "undefined")
        return false;
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    };
    const ModernNavigation$1 = "";
    const ModernNavigation = ({
      className = "",
      position = "fixed-top",
      onNavigate,
      brand = "Health Tracker",
      brandHref = "#home"
    }) => {
      const navRef = reactExports.useRef(null);
      const onNavigateRef = reactExports.useRef(onNavigate);
      const managerRef = reactExports.useRef();
      const { isAuthenticated, loading: authLoading } = useAuth();
      onNavigateRef.current = onNavigate;
      if (!managerRef.current) {
        managerRef.current = NavigationManager.getInstance();
      }
      const [config2, setConfig] = reactExports.useState(() => {
        var _a, _b;
        return (_b = (_a = managerRef.current) == null ? void 0 : _a.getConfig()) != null ? _b : { items: [] };
      });
      const [navState, setNavState] = reactExports.useState(() => {
        var _a;
        return {
          isOpen: false,
          activeItem: ((_a = managerRef.current) == null ? void 0 : _a.getState().activeItem) || "home",
          hoveredItem: null,
          focusedItem: null,
          keyboardMode: false
        };
      });
      const [isScrolled, setIsScrolled] = reactExports.useState(false);
      const reducedMotion = reactExports.useMemo(() => prefersReducedMotion(), []);
      reactExports.useEffect(() => {
        const handleScroll = () => {
          setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);
      reactExports.useEffect(() => {
        const manager = managerRef.current;
        if (navRef.current) {
          manager.setElement(navRef.current);
        }
        const unsubscribe = manager.subscribe(setNavState);
        setConfig(manager.getConfig());
        if (!authLoading) {
          manager.updateAuthState(isAuthenticated);
        }
        return () => {
          unsubscribe();
        };
      }, [isAuthenticated, authLoading]);
      const handleItemClick = reactExports.useCallback((itemId) => {
        var _a;
        (_a = onNavigateRef.current) == null ? void 0 : _a.call(onNavigateRef, itemId);
        managerRef.current.navigate(itemId);
      }, []);
      const handleItemKeyDown = reactExports.useCallback((e, itemId) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleItemClick(itemId);
        }
      }, [handleItemClick]);
      const handleItemMouseEnter = reactExports.useCallback((itemId) => {
        managerRef.current.setHoveredItem(itemId);
      }, []);
      const handleItemMouseLeave = reactExports.useCallback(() => {
        managerRef.current.setHoveredItem(null);
      }, []);
      const handleBrandClick = reactExports.useCallback(() => {
        if (brandHref.startsWith("#")) {
          const homeItem = config2.items.find((item) => item.href === brandHref);
          if (homeItem) {
            handleItemClick(homeItem.id);
          }
        } else {
          window.location.href = brandHref;
        }
      }, [brandHref, config2.items, handleItemClick]);
      const getItemIcon = reactExports.useCallback((itemId) => {
        const iconMap = {
          "home": "🏠",
          "add-meals": "🍽️",
          "journal": "📔"
        };
        return iconMap[itemId] || "📄";
      }, []);
      const navClasses = reactExports.useMemo(() => [
        "modern-nav",
        `modern-nav--${position}`,
        className,
        navState.keyboardMode && "modern-nav--keyboard",
        reducedMotion && "modern-nav--reduced-motion",
        isScrolled && "modern-nav--scrolled"
      ].filter(Boolean).join(" "), [
        position,
        className,
        navState.keyboardMode,
        reducedMotion,
        isScrolled
      ]);
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "nav",
        {
          ref: navRef,
          className: navClasses,
          "aria-label": "Main navigation",
          role: "navigation",
          children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "modern-nav__container", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                className: "modern-nav__brand",
                onClick: handleBrandClick,
                "aria-label": `Go to ${brand} home page`,
                type: "button",
                children: brand
              },
              void 0,
              false,
              {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/navigation/ModernNavigation.tsx",
                lineNumber: 156,
                columnNumber: 17
              },
              globalThis
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "modern-nav__list", role: "menubar", children: config2.items.map((item) => {
              const isActive = navState.activeItem === item.id;
              const isHovered = navState.hoveredItem === item.id;
              const isFocused = navState.focusedItem === item.id;
              const itemClasses = [
                "modern-nav__item",
                isActive && "modern-nav__item--active",
                isHovered && "modern-nav__item--hovered",
                isFocused && "modern-nav__item--focused"
              ].filter(Boolean).join(" ");
              return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: itemClasses, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  className: "modern-nav__link",
                  "data-nav-item": item.id,
                  onClick: () => handleItemClick(item.id),
                  onKeyDown: (e) => handleItemKeyDown(e, item.id),
                  onMouseEnter: () => handleItemMouseEnter(item.id),
                  onMouseLeave: handleItemMouseLeave,
                  role: "menuitem",
                  "aria-current": isActive ? "page" : void 0,
                  "aria-label": item.ariaLabel || `Navigate to ${item.label}`,
                  type: "button",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "modern-nav__icon", children: getItemIcon(item.id) }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/navigation/ModernNavigation.tsx",
                      lineNumber: 194,
                      columnNumber: 37
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "modern-nav__label", children: item.label }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/navigation/ModernNavigation.tsx",
                      lineNumber: 197,
                      columnNumber: 37
                    }, globalThis)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/navigation/ModernNavigation.tsx",
                  lineNumber: 182,
                  columnNumber: 33
                },
                globalThis
              ) }, item.id, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/navigation/ModernNavigation.tsx",
                lineNumber: 181,
                columnNumber: 29
              }, globalThis);
            }) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/navigation/ModernNavigation.tsx",
              lineNumber: 166,
              columnNumber: 17
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "modern-nav__right" }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/navigation/ModernNavigation.tsx",
              lineNumber: 206,
              columnNumber: 17
            }, globalThis)
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/navigation/ModernNavigation.tsx",
            lineNumber: 154,
            columnNumber: 13
          }, globalThis)
        },
        void 0,
        false,
        {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/navigation/ModernNavigation.tsx",
          lineNumber: 148,
          columnNumber: 9
        },
        globalThis
      );
    };
    const Preloader$1 = "";
    const Preloader = ({
      onComplete,
      duration = 800,
      minDisplayTime = 600,
      className = ""
    }) => {
      const [progress, setProgress] = reactExports.useState(0);
      const [isVisible, setIsVisible] = reactExports.useState(true);
      const [isExiting, setIsExiting] = reactExports.useState(false);
      const [currentPhase, setCurrentPhase] = reactExports.useState("loading");
      const loadingMessages = reactExports.useMemo(() => [
        "Initializing Health Hub...",
        "Loading Wellness Modules...",
        "Syncing Health Data...",
        "Preparing Your Dashboard...",
        "Ready to Track Your Journey!"
      ], []);
      const [currentMessage, setCurrentMessage] = reactExports.useState(loadingMessages[0]);
      reactExports.useEffect(() => {
        const startTime = Date.now();
        let animationFrame;
        let messageIndex = 0;
        const updateProgress = () => {
          const elapsed = Date.now() - startTime;
          const newProgress = Math.min(elapsed / duration * 100, 100);
          setProgress(newProgress);
          const expectedMessageIndex = Math.floor(newProgress / 100 * (loadingMessages.length - 1));
          if (expectedMessageIndex !== messageIndex && expectedMessageIndex < loadingMessages.length) {
            messageIndex = expectedMessageIndex;
            setCurrentMessage(loadingMessages[messageIndex]);
          }
          if (newProgress < 100) {
            animationFrame = requestAnimationFrame(updateProgress);
          } else {
            setCurrentPhase("complete");
            setCurrentMessage("Welcome to Your Health Journey!");
            const totalElapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, minDisplayTime - totalElapsed);
            setTimeout(() => {
              setCurrentPhase("exiting");
              setIsExiting(true);
              setTimeout(() => {
                setIsVisible(false);
                onComplete == null ? void 0 : onComplete();
              }, 300);
            }, remainingTime);
          }
        };
        animationFrame = requestAnimationFrame(updateProgress);
        return () => {
          if (animationFrame) {
            cancelAnimationFrame(animationFrame);
          }
        };
      }, [duration, minDisplayTime, onComplete, loadingMessages]);
      const progressClasses = reactExports.useMemo(() => [
        "preloader",
        `preloader--${currentPhase}`,
        isExiting && "preloader--exiting",
        className
      ].filter(Boolean).join(" "), [currentPhase, isExiting, className]);
      if (!isVisible) {
        return null;
      }
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: progressClasses, children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__bg", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__grid" }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
            lineNumber: 96,
            columnNumber: 17
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__orbs", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__orb preloader__orb--1" }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
              lineNumber: 98,
              columnNumber: 21
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__orb preloader__orb--2" }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
              lineNumber: 99,
              columnNumber: 21
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__orb preloader__orb--3" }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
              lineNumber: 100,
              columnNumber: 21
            }, globalThis)
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
            lineNumber: 97,
            columnNumber: 17
          }, globalThis)
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
          lineNumber: 95,
          columnNumber: 13
        }, globalThis),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__content", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__brand", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__logo", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__logo-icon", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__health-icon", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__heart", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__heart-beat" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
                lineNumber: 111,
                columnNumber: 37
              }, globalThis) }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
                lineNumber: 110,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__pulse-rings", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__pulse-ring preloader__pulse-ring--1" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
                  lineNumber: 114,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__pulse-ring preloader__pulse-ring--2" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
                  lineNumber: 115,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__pulse-ring preloader__pulse-ring--3" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
                  lineNumber: 116,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
                lineNumber: 113,
                columnNumber: 33
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
              lineNumber: 109,
              columnNumber: 29
            }, globalThis) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
              lineNumber: 108,
              columnNumber: 25
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__brand-text", children: [
              "Health",
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "preloader__brand-accent", children: "Tracker" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
                lineNumber: 121,
                columnNumber: 35
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
              lineNumber: 120,
              columnNumber: 25
            }, globalThis)
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
            lineNumber: 107,
            columnNumber: 21
          }, globalThis) }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
            lineNumber: 106,
            columnNumber: 17
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__status", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__message", children: currentMessage }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
            lineNumber: 128,
            columnNumber: 21
          }, globalThis) }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
            lineNumber: 127,
            columnNumber: 17
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__progress-section", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__progress-ring", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("svg", { className: "preloader__ring-svg", viewBox: "0 0 120 120", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "circle",
                  {
                    className: "preloader__ring-bg",
                    cx: "60",
                    cy: "60",
                    r: "50",
                    fill: "none",
                    strokeWidth: "4"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
                    lineNumber: 135,
                    columnNumber: 29
                  },
                  globalThis
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "circle",
                  {
                    className: "preloader__ring-progress",
                    cx: "60",
                    cy: "60",
                    r: "50",
                    fill: "none",
                    strokeWidth: "4",
                    style: {
                      strokeDasharray: 314,
                      strokeDashoffset: 314 - progress * 314 / 100
                    }
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
                    lineNumber: 143,
                    columnNumber: 29
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
                lineNumber: 134,
                columnNumber: 25
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__percentage", children: [
                Math.round(progress),
                "%"
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
                lineNumber: 156,
                columnNumber: 25
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
              lineNumber: 133,
              columnNumber: 21
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__pulse-bars", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__bar" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
                lineNumber: 163,
                columnNumber: 25
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__bar" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
                lineNumber: 164,
                columnNumber: 25
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__bar" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
                lineNumber: 165,
                columnNumber: 25
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__bar" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
                lineNumber: 166,
                columnNumber: 25
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__bar" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
                lineNumber: 167,
                columnNumber: 25
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
              lineNumber: 162,
              columnNumber: 21
            }, globalThis)
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
            lineNumber: 132,
            columnNumber: 17
          }, globalThis)
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
          lineNumber: 104,
          columnNumber: 13
        }, globalThis),
        currentPhase === "complete" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__success", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "preloader__success-ring", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("svg", { viewBox: "0 0 52 52", className: "preloader__success-svg", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "circle",
            {
              className: "preloader__success-circle",
              cx: "26",
              cy: "26",
              r: "20",
              fill: "none"
            },
            void 0,
            false,
            {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
              lineNumber: 177,
              columnNumber: 29
            },
            globalThis
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "path",
            {
              className: "preloader__success-check",
              fill: "none",
              d: "M14,27 L22,35 L38,19"
            },
            void 0,
            false,
            {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
              lineNumber: 184,
              columnNumber: 29
            },
            globalThis
          )
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
          lineNumber: 176,
          columnNumber: 25
        }, globalThis) }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
          lineNumber: 175,
          columnNumber: 21
        }, globalThis) }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
          lineNumber: 174,
          columnNumber: 17
        }, globalThis)
      ] }, void 0, true, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/Preloader.tsx",
        lineNumber: 93,
        columnNumber: 9
      }, globalThis);
    };
    class ContentManager {
      constructor(config2 = {}) {
        __publicField(this, "state");
        __publicField(this, "config");
        __publicField(this, "subscribers");
        __publicField(this, "intersectionObserver");
        this.config = __spreadValues({
          enableLazyLoading: true,
          imageFormats: ["webp", "jpg", "png"],
          seoEnabled: true
        }, config2);
        this.state = this.getInitialState();
        this.subscribers = /* @__PURE__ */ new Set();
        this.intersectionObserver = null;
        this.init();
      }
      getInitialState() {
        return {
          isLoaded: false,
          currentSection: "hero",
          lazyImages: /* @__PURE__ */ new Map(),
          seoData: {}
        };
      }
      init() {
        if (this.config.enableLazyLoading) {
          this.setupLazyLoading();
        }
        this.setState({ isLoaded: true });
      }
      setupLazyLoading() {
        if (!("IntersectionObserver" in window))
          return;
        this.intersectionObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              var _a;
              if (entry.isIntersecting) {
                const img = entry.target;
                this.loadImage(img);
                (_a = this.intersectionObserver) == null ? void 0 : _a.unobserve(img);
              }
            });
          },
          { rootMargin: "50px" }
        );
      }
      loadImage(img) {
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.classList.add("loaded");
          this.updateImageState(img.dataset.id || src, true);
        }
      }
      updateImageState(id, loaded) {
        const newLazyImages = new Map(this.state.lazyImages);
        newLazyImages.set(id, loaded);
        this.setState({ lazyImages: newLazyImages });
      }
      observeImage(img) {
        if (this.intersectionObserver && img) {
          this.intersectionObserver.observe(img);
        }
      }
      setCurrentSection(section) {
        if (section !== this.state.currentSection) {
          this.setState({ currentSection: section });
        }
      }
      setSeoData(data) {
        this.setState({ seoData: __spreadValues(__spreadValues({}, this.state.seoData), data) });
      }
      getState() {
        return __spreadValues({}, this.state);
      }
      setState(newState) {
        this.state = __spreadValues(__spreadValues({}, this.state), newState);
        this.notify();
      }
      subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
      }
      notify() {
        this.subscribers.forEach((callback) => callback(this.state));
      }
      destroy() {
        if (this.intersectionObserver) {
          this.intersectionObserver.disconnect();
        }
        this.subscribers.clear();
      }
    }
    let contentManagerInstance = null;
    const useContentManager = () => {
      const [state, setState] = reactExports.useState({
        isLoaded: false,
        currentSection: "hero",
        lazyImages: /* @__PURE__ */ new Map(),
        seoData: {}
      });
      reactExports.useEffect(() => {
        if (!contentManagerInstance) {
          contentManagerInstance = new ContentManager();
        }
        const unsubscribe = contentManagerInstance.subscribe(setState);
        setState(contentManagerInstance.getState());
        return () => {
          unsubscribe();
        };
      }, []);
      const setCurrentSection = reactExports.useCallback((section) => {
        contentManagerInstance == null ? void 0 : contentManagerInstance.setCurrentSection(section);
      }, []);
      const setSeoData = reactExports.useCallback((data) => {
        contentManagerInstance == null ? void 0 : contentManagerInstance.setSeoData(data);
      }, []);
      const observeImage = reactExports.useCallback((img) => {
        contentManagerInstance == null ? void 0 : contentManagerInstance.observeImage(img);
      }, []);
      return __spreadProps(__spreadValues({}, state), {
        setCurrentSection,
        setSeoData,
        observeImage
      });
    };
    class CalorieCalculatorService {
      static calculateBMR(profile) {
        const { height_cm, weight_kg, age = 30, gender = "male" } = profile;
        if (gender === "male") {
          return 5 * weight_kg + 6.25 * height_cm - 5 * age + 5;
        } else {
          return 5 * weight_kg + 6.25 * height_cm - 5 * age - 161;
        }
      }
      static calculateTDEE(bmr, activityLevel) {
        const multiplier = this.ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
        return Math.round(bmr * multiplier);
      }
      static convertDurationToWeeks(duration, unit) {
        switch (unit) {
          case "days":
            return duration / 7;
          case "weeks":
            return duration;
          case "months":
            return duration * 4.33;
          default:
            return duration;
        }
      }
      static calculateTargetCalories(profile) {
        const bmr = this.calculateBMR(profile);
        const tdee = this.calculateTDEE(bmr, profile.activity_level);
        const { weight_kg, target_weight_kg, target_duration, target_duration_unit } = profile;
        const weightChangeKg = target_weight_kg - weight_kg;
        const durationWeeks = this.convertDurationToWeeks(target_duration, target_duration_unit);
        const weightChangePerWeek = durationWeeks > 0 ? weightChangeKg / durationWeeks : 0;
        const dailyCalorieDeficit = weightChangePerWeek * this.CALORIES_PER_KG / 7;
        let targetCalories = tdee + dailyCalorieDeficit;
        const minCalories = profile.gender === "male" ? 1300 : 1100;
        if (targetCalories < minCalories) {
          targetCalories = minCalories;
        }
        return {
          bmr: Math.round(bmr),
          tdee,
          targetCalories: Math.round(targetCalories),
          weightChangePerWeek: Math.round(weightChangePerWeek * 100) / 100,
          dailyCalorieDeficit: Math.round(dailyCalorieDeficit)
        };
      }
      static getCalorieRecommendation(calculation) {
        const { weightChangePerWeek, targetCalories, tdee } = calculation;
        if (weightChangePerWeek > 0) {
          return {
            message: `To gain ${Math.abs(weightChangePerWeek)}kg per week, aim for ${targetCalories} calories daily`,
            type: "gain",
            weeklyGoal: `+${Math.abs(weightChangePerWeek)}kg per week`
          };
        } else if (weightChangePerWeek < 0) {
          return {
            message: `To lose ${Math.abs(weightChangePerWeek)}kg per week, aim for ${targetCalories} calories daily`,
            type: "loss",
            weeklyGoal: `-${Math.abs(weightChangePerWeek)}kg per week`
          };
        } else {
          return {
            message: `To maintain your current weight, aim for ${tdee} calories daily`,
            type: "maintain",
            weeklyGoal: "Maintain current weight"
          };
        }
      }
      static getMacroRatios(orientation) {
        if (!orientation) {
          return { protein: 0.3, carbs: 0.45, fat: 0.25 };
        }
        switch (orientation) {
          case "energy_focused":
          case "energetic_bulking":
            return { protein: 0.2, carbs: 0.4, fat: 0.4 };
          case "lean_muscle_building":
          case "muscle_preservation":
            return { protein: 0.3, carbs: 0.35, fat: 0.35 };
          default:
            return { protein: 0.3, carbs: 0.45, fat: 0.25 };
        }
      }
      static validateProfile(profile) {
        const errors = [];
        if (!profile.height_cm || profile.height_cm <= 0) {
          errors.push("Height is required");
        }
        if (!profile.weight_kg || profile.weight_kg <= 0) {
          errors.push("Current weight is required");
        }
        if (!profile.target_weight_kg || profile.target_weight_kg <= 0) {
          errors.push("Target weight is required");
        }
        if (!profile.target_duration || profile.target_duration <= 0) {
          errors.push("Target duration is required");
        }
        return {
          isValid: errors.length === 0,
          errors
        };
      }
    }
    __publicField(CalorieCalculatorService, "ACTIVITY_MULTIPLIERS", {
      sedentary: 1.05,
      light: 1.2,
      moderate: 1.375,
      active: 1.55,
      very_active: 1.725
    });
    __publicField(CalorieCalculatorService, "CALORIES_PER_KG", 7700);
    const useCalorieTracker = () => {
      const { user } = useAuth();
      const [profile, setProfile] = reactExports.useState(null);
      const [todaysMeals, setTodaysMeals] = reactExports.useState([]);
      const [isLoading, setIsLoading] = reactExports.useState(true);
      const loadProfile = () => __async(exports, null, function* () {
        if (!user) {
          setIsLoading(false);
          return;
        }
        try {
          const { data } = yield SupabaseService$1.getUserProfile(user.id);
          let additionalData = { target_weight_kg: 0, target_duration: 0, target_duration_unit: "weeks", orientation: "" };
          try {
            const stored = localStorage.getItem(`profile_extra_${user.id}`);
            if (stored) {
              additionalData = JSON.parse(stored);
            }
          } catch (e) {
            console.warn("Failed to load additional profile data:", e);
          }
          if (data && data.height_cm && data.weight_kg && additionalData.target_weight_kg && additionalData.target_duration) {
            const userProfile = {
              height_cm: data.height_cm,
              weight_kg: data.weight_kg,
              target_weight_kg: additionalData.target_weight_kg,
              target_duration: additionalData.target_duration,
              target_duration_unit: additionalData.target_duration_unit,
              activity_level: data.activity_level || "moderate",
              age: 30,
              gender: "male",
              orientation: additionalData.orientation || ""
            };
            setProfile(userProfile);
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error("Error loading profile:", error);
          setProfile(null);
        } finally {
          setIsLoading(false);
        }
      });
      const loadTodaysMeals = () => __async(exports, null, function* () {
        if (!user) {
          setTodaysMeals([]);
          return;
        }
        try {
          const { data, error } = yield SupabaseService$1.getTodaysMeals(user.id);
          if (error) {
            console.error("Error loading today's meals:", error);
            setTodaysMeals([]);
            return;
          }
          const transformedMeals = data.map((meal) => ({
            id: meal.id,
            name: meal.meal_name,
            calories: meal.total_calories,
            protein: meal.total_protein_g,
            carbs: meal.total_carbs_g,
            fat: meal.total_fat_g,
            mealType: meal.meal_type,
            time: meal.time ? (/* @__PURE__ */ new Date(`1970-01-01T${meal.time}`)).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true
            }) : "Not specified"
          }));
          setTodaysMeals(transformedMeals);
        } catch (error) {
          console.error("Failed to load today's meals:", error);
          setTodaysMeals([]);
        }
      });
      reactExports.useEffect(() => {
        loadProfile();
        loadTodaysMeals();
      }, [user]);
      const calorieData = reactExports.useMemo(() => {
        if (!profile) {
          return {
            targetCalories: 0,
            currentCalories: 0,
            remainingCalories: 0,
            percentageConsumed: 0,
            hasProfile: false,
            isLoading
          };
        }
        const validation = CalorieCalculatorService.validateProfile(profile);
        if (!validation.isValid) {
          return {
            targetCalories: 0,
            currentCalories: 0,
            remainingCalories: 0,
            percentageConsumed: 0,
            hasProfile: false,
            isLoading
          };
        }
        const calculation = CalorieCalculatorService.calculateTargetCalories(profile);
        const recommendation = CalorieCalculatorService.getCalorieRecommendation(calculation);
        const currentCalories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
        const remainingCalories = calculation.targetCalories - currentCalories;
        const percentageConsumed = calculation.targetCalories > 0 ? Math.round(currentCalories / calculation.targetCalories * 100) : 0;
        return {
          targetCalories: calculation.targetCalories,
          currentCalories,
          remainingCalories,
          percentageConsumed,
          calculation,
          recommendation,
          hasProfile: true,
          isLoading
        };
      }, [profile, todaysMeals, isLoading]);
      const refreshData = () => __async(exports, null, function* () {
        yield loadProfile();
        yield loadTodaysMeals();
      });
      return {
        calorieData,
        todaysMeals,
        profile,
        refreshData
      };
    };
    const Hero$1 = "";
    const Hero = ({
      title = "Your Health Journey Starts Here",
      subtitle = "Track nutrition, monitor wellness, achieve your goals",
      description = "Take control of your health with comprehensive meal tracking, nutrition insights, and personalized wellness monitoring.",
      primaryCtaText = "Sign In to Get Started",
      secondaryCtaText = "",
      onPrimaryCtaClick,
      onSecondaryCtaClick,
      showParticles = false,
      showAchievements = false,
      autoScroll = false
    }) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      const heroRef = reactExports.useRef(null);
      const contentRef = reactExports.useRef(null);
      reactExports.useRef(null);
      reactExports.useRef();
      const [isVisible, setIsVisible] = reactExports.useState(false);
      const [mousePosition, setMousePosition] = reactExports.useState({ x: 0, y: 0 });
      const [isHovered, setIsHovered] = reactExports.useState(false);
      const [reducedMotion, setReducedMotion] = reactExports.useState(false);
      const { setCurrentSection } = useContentManager();
      const { isAuthenticated, user } = useAuth();
      const { calorieData, todaysMeals, profile } = useCalorieTracker();
      const nutritionSummary = reactExports.useMemo(() => {
        const totals = todaysMeals.reduce(
          (acc, meal) => ({
            calories: acc.calories + meal.calories,
            protein: acc.protein + meal.protein,
            carbs: acc.carbs + meal.carbs,
            fat: acc.fat + meal.fat
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
        const macroRatios = CalorieCalculatorService.getMacroRatios(profile == null ? void 0 : profile.orientation);
        return __spreadProps(__spreadValues({}, totals), {
          goalCalories: calorieData.targetCalories,
          goalProtein: Math.round(calorieData.targetCalories * macroRatios.protein / 4),
          // protein has 4 calories per gram
          goalCarbs: Math.round(calorieData.targetCalories * macroRatios.carbs / 4),
          // carbs has 4 calories per gram
          goalFat: Math.round(calorieData.targetCalories * macroRatios.fat / 9)
          // fat has 9 calories per gram
        });
      }, [todaysMeals, calorieData.targetCalories, profile == null ? void 0 : profile.orientation]);
      reactExports.useMemo(() => {
        if (!showParticles)
          return [];
        return Array.from({ length: 30 }, (_, i) => ({
          id: i,
          delay: Math.random() * 4,
          duration: 4 + Math.random() * 3,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 2 + Math.random() * 3
        }));
      }, [showParticles]);
      reactExports.useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mediaQuery.matches);
        const handleChange = (e) => {
          setReducedMotion(e.matches);
        };
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      }, []);
      reactExports.useEffect(() => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            var _a2, _b2;
            if (entry.isIntersecting) {
              setCurrentSection("hero");
              setIsVisible(true);
              if (!reducedMotion) {
                (_a2 = heroRef.current) == null ? void 0 : _a2.classList.add("hero--animate-in");
                (_b2 = contentRef.current) == null ? void 0 : _b2.classList.add("hero__content--stagger");
              }
            }
          },
          {
            threshold: 0.3,
            rootMargin: "0px 0px -10% 0px"
          }
        );
        if (heroRef.current) {
          observer.observe(heroRef.current);
        }
        return () => observer.disconnect();
      }, [setCurrentSection, reducedMotion]);
      const handleMouseMove = reactExports.useCallback((e) => {
        if (!heroRef.current || reducedMotion)
          return;
        const rect = heroRef.current.getBoundingClientRect();
        const newPosition = {
          x: (e.clientX - rect.left) / rect.width * 100,
          y: (e.clientY - rect.top) / rect.height * 100
        };
        setMousePosition(newPosition);
      }, [reducedMotion]);
      reactExports.useEffect(() => {
        if (!heroRef.current || reducedMotion)
          return;
        let timeoutId;
        const throttledMouseMove = (e) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => handleMouseMove(e), 16);
        };
        const heroElement = heroRef.current;
        heroElement.addEventListener("mousemove", throttledMouseMove);
        heroElement.addEventListener("mouseenter", () => setIsHovered(true));
        heroElement.addEventListener("mouseleave", () => setIsHovered(false));
        return () => {
          heroElement.removeEventListener("mousemove", throttledMouseMove);
          heroElement.removeEventListener("mouseenter", () => setIsHovered(true));
          heroElement.removeEventListener("mouseleave", () => setIsHovered(false));
          clearTimeout(timeoutId);
        };
      }, [handleMouseMove, reducedMotion]);
      const handlePrimaryCtaClick = reactExports.useCallback(() => {
        if (onPrimaryCtaClick) {
          onPrimaryCtaClick();
        } else {
          const contactSection = document.getElementById("contact");
          contactSection == null ? void 0 : contactSection.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
            block: "start"
          });
        }
      }, [onPrimaryCtaClick, reducedMotion]);
      reactExports.useCallback(() => {
        if (onSecondaryCtaClick) {
          onSecondaryCtaClick();
        } else {
          const projectsSection = document.getElementById("projects");
          projectsSection == null ? void 0 : projectsSection.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
            block: "start"
          });
        }
      }, [onSecondaryCtaClick, reducedMotion]);
      reactExports.useCallback((e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (autoScroll) {
            const aboutSection = document.getElementById("about");
            aboutSection == null ? void 0 : aboutSection.scrollIntoView({
              behavior: reducedMotion ? "auto" : "smooth",
              block: "start"
            });
          }
        }
      }, [autoScroll, reducedMotion]);
      reactExports.useCallback(() => {
        const aboutSection = document.getElementById("about");
        aboutSection == null ? void 0 : aboutSection.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start"
        });
      }, [reducedMotion]);
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "section",
        {
          ref: heroRef,
          id: "hero",
          className: "hero",
          "aria-label": "Hero section - Health Tracker",
          role: "banner",
          children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__container", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__content-wrapper", ref: contentRef, children: !isAuthenticated ? (
            // Not signed in - Show simple sign in interface
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__auth-content", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__auth-visual", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__health-icon", children: "🍎" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                lineNumber: 245,
                columnNumber: 33
              }, globalThis) }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                lineNumber: 244,
                columnNumber: 29
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__auth-text", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "hero__title", children: title }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                  lineNumber: 249,
                  columnNumber: 33
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "hero__subtitle", children: subtitle }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                  lineNumber: 250,
                  columnNumber: 33
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "hero__description", children: description }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                  lineNumber: 251,
                  columnNumber: 33
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__cta-group", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "button",
                  {
                    className: "hero__cta hero__cta--primary",
                    onClick: handlePrimaryCtaClick,
                    "aria-label": "Sign in to start tracking your health",
                    type: "button",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__cta-icon", children: "🔑" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 260,
                        columnNumber: 41
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__cta-text", children: primaryCtaText }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 261,
                        columnNumber: 41
                      }, globalThis)
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 254,
                    columnNumber: 37
                  },
                  globalThis
                ) }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                  lineNumber: 253,
                  columnNumber: 33
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                lineNumber: 248,
                columnNumber: 29
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
              lineNumber: 243,
              columnNumber: 25
            }, globalThis)
          ) : (
            // Signed in - Show personalized dashboard with meals visualization
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__dashboard-content", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__welcome", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "hero__dashboard-greeting", children: [
                "Welcome back, ",
                ((_a = user == null ? void 0 : user.user_metadata) == null ? void 0 : _a.full_name) || ((_b = user == null ? void 0 : user.email) == null ? void 0 : _b.split("@")[0]) || "there",
                "! 👋"
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                lineNumber: 270,
                columnNumber: 33
              }, globalThis) }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                lineNumber: 269,
                columnNumber: 29
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__nutrition-dashboard", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-progress-section", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-status", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-current", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__calorie-number", children: nutritionSummary.calories }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 280,
                        columnNumber: 45
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__calorie-unit", children: "cal" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 281,
                        columnNumber: 45
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 279,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-divider", children: "of" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 283,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-target", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__calorie-number", children: nutritionSummary.goalCalories }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 285,
                        columnNumber: 45
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__calorie-unit", children: "cal" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 286,
                        columnNumber: 45
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 284,
                      columnNumber: 41
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 278,
                    columnNumber: 37
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__progress-container", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__progress-bar", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className: `hero__progress-fill ${nutritionSummary.calories > nutritionSummary.goalCalories ? "hero__progress-fill--over" : ""}`,
                          style: {
                            width: `${Math.min(nutritionSummary.calories / nutritionSummary.goalCalories * 100, 100)}%`
                          }
                        },
                        void 0,
                        false,
                        {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 293,
                          columnNumber: 45
                        },
                        globalThis
                      ),
                      nutritionSummary.calories > nutritionSummary.goalCalories && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className: "hero__progress-overflow",
                          style: {
                            width: `${Math.min((nutritionSummary.calories - nutritionSummary.goalCalories) / nutritionSummary.goalCalories * 100, 50)}%`
                          }
                        },
                        void 0,
                        false,
                        {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 302,
                          columnNumber: 49
                        },
                        globalThis
                      )
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 292,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__progress-labels", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__progress-label hero__progress-label--start", children: "0" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 311,
                        columnNumber: 45
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__progress-label hero__progress-label--target", children: "Target" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 312,
                        columnNumber: 45
                      }, globalThis),
                      nutritionSummary.calories > nutritionSummary.goalCalories && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__progress-label hero__progress-label--over", children: [
                        "+",
                        nutritionSummary.calories - nutritionSummary.goalCalories
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 314,
                        columnNumber: 49
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 310,
                      columnNumber: 41
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 291,
                    columnNumber: 37
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: `hero__calorie-status-message ${nutritionSummary.calories < nutritionSummary.goalCalories * 0.8 ? "hero__calorie-status--low" : nutritionSummary.calories > nutritionSummary.goalCalories * 1.1 ? "hero__calorie-status--high" : "hero__calorie-status--good"}`, children: [
                    nutritionSummary.calories < nutritionSummary.goalCalories * 0.8 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__status-icon", children: "🟡" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 327,
                        columnNumber: 49
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                        "Need ",
                        nutritionSummary.goalCalories - nutritionSummary.calories,
                        " more calories"
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 328,
                        columnNumber: 49
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 326,
                      columnNumber: 45
                    }, globalThis),
                    nutritionSummary.calories > nutritionSummary.goalCalories * 1.1 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__status-icon", children: "🔴" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 333,
                        columnNumber: 49
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                        nutritionSummary.calories - nutritionSummary.goalCalories,
                        " calories over target"
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 334,
                        columnNumber: 49
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 332,
                      columnNumber: 45
                    }, globalThis),
                    nutritionSummary.calories >= nutritionSummary.goalCalories * 0.8 && nutritionSummary.calories <= nutritionSummary.goalCalories * 1.1 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__status-icon", children: "🟢" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 340,
                        columnNumber: 49
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "On track with your calorie goals!" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 341,
                        columnNumber: 49
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 339,
                      columnNumber: 45
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 320,
                    columnNumber: 37
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                  lineNumber: 277,
                  columnNumber: 33
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__macro-cards", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__macro-card hero__macro-card--protein", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__macro-header", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__macro-icon", children: "💪" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 351,
                        columnNumber: 45
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__macro-name", children: "Protein" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 352,
                        columnNumber: 45
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 350,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__macro-values", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__macro-current", children: [
                        nutritionSummary.protein,
                        "g"
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 355,
                        columnNumber: 45
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__macro-target", children: [
                        "/ ",
                        nutritionSummary.goalProtein,
                        "g"
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 356,
                        columnNumber: 45
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 354,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__macro-progress", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className: "hero__macro-progress-bar hero__macro-progress-bar--protein",
                        style: { width: `${Math.min(nutritionSummary.protein / nutritionSummary.goalProtein * 100, 100)}%` }
                      },
                      void 0,
                      false,
                      {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 359,
                        columnNumber: 45
                      },
                      globalThis
                    ) }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 358,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__macro-percentage", children: [
                      Math.round(nutritionSummary.protein / nutritionSummary.goalProtein * 100),
                      "%"
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 364,
                      columnNumber: 41
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 349,
                    columnNumber: 37
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__macro-card hero__macro-card--carbs", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__macro-header", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__macro-icon", children: "🍞" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 371,
                        columnNumber: 45
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__macro-name", children: "Carbs" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 372,
                        columnNumber: 45
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 370,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__macro-values", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__macro-current", children: [
                        nutritionSummary.carbs,
                        "g"
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 375,
                        columnNumber: 45
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__macro-target", children: [
                        "/ ",
                        nutritionSummary.goalCarbs,
                        "g"
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 376,
                        columnNumber: 45
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 374,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__macro-progress", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className: "hero__macro-progress-bar hero__macro-progress-bar--carbs",
                        style: { width: `${Math.min(nutritionSummary.carbs / nutritionSummary.goalCarbs * 100, 100)}%` }
                      },
                      void 0,
                      false,
                      {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 379,
                        columnNumber: 45
                      },
                      globalThis
                    ) }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 378,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__macro-percentage", children: [
                      Math.round(nutritionSummary.carbs / nutritionSummary.goalCarbs * 100),
                      "%"
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 384,
                      columnNumber: 41
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 369,
                    columnNumber: 37
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__macro-card hero__macro-card--fat", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__macro-header", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__macro-icon", children: "🥑" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 391,
                        columnNumber: 45
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__macro-name", children: "Fat" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 392,
                        columnNumber: 45
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 390,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__macro-values", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__macro-current", children: [
                        nutritionSummary.fat,
                        "g"
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 395,
                        columnNumber: 45
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__macro-target", children: [
                        "/ ",
                        nutritionSummary.goalFat,
                        "g"
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 396,
                        columnNumber: 45
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 394,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__macro-progress", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className: "hero__macro-progress-bar hero__macro-progress-bar--fat",
                        style: { width: `${Math.min(nutritionSummary.fat / nutritionSummary.goalFat * 100, 100)}%` }
                      },
                      void 0,
                      false,
                      {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 399,
                        columnNumber: 45
                      },
                      globalThis
                    ) }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 398,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__macro-percentage", children: [
                      Math.round(nutritionSummary.fat / nutritionSummary.goalFat * 100),
                      "%"
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 404,
                      columnNumber: 41
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 389,
                    columnNumber: 37
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                  lineNumber: 348,
                  columnNumber: 33
                }, globalThis),
                calorieData.recommendation && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: `hero__goal-recommendation hero__goal-recommendation--${calorieData.recommendation.type}`, children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__recommendation-icon", children: [
                    calorieData.recommendation.type === "loss" && "📉",
                    calorieData.recommendation.type === "gain" && "📈",
                    calorieData.recommendation.type === "maintain" && "⚖️"
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 413,
                    columnNumber: 41
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__recommendation-text", children: calorieData.recommendation.message }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 418,
                    columnNumber: 41
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                  lineNumber: 412,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__meals-list", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "hero__meals-title", children: "Today's Meals" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 426,
                    columnNumber: 37
                  }, globalThis),
                  todaysMeals.length > 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__meals-grid", children: todaysMeals.map((meal, index2) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__meal-card hero__meal-card--compact", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__meal-header", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__meal-type", children: [
                        meal.mealType === "breakfast" && "🌅",
                        meal.mealType === "lunch" && "☀️",
                        meal.mealType === "dinner" && "🌙",
                        meal.mealType === "snack" && "🍿",
                        meal.mealType
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 432,
                        columnNumber: 57
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__meal-calories", children: [
                        meal.calories,
                        " cal"
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 439,
                        columnNumber: 57
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 431,
                      columnNumber: 53
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__meal-name", children: meal.name }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 441,
                      columnNumber: 53
                    }, globalThis)
                  ] }, meal.id, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 430,
                    columnNumber: 49
                  }, globalThis)) }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 428,
                    columnNumber: 41
                  }, globalThis) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__no-meals", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { children: "No meals tracked today yet" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 447,
                      columnNumber: 45
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "button",
                      {
                        className: "hero__add-meal-btn",
                        onClick: () => onPrimaryCtaClick == null ? void 0 : onPrimaryCtaClick(),
                        children: "Add Your First Meal"
                      },
                      void 0,
                      false,
                      {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 448,
                        columnNumber: 45
                      },
                      globalThis
                    )
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 446,
                    columnNumber: 41
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                  lineNumber: 425,
                  columnNumber: 33
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                lineNumber: 275,
                columnNumber: 29
              }, globalThis),
              calorieData.hasProfile ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-tracking", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__metabolic-dashboard", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__metabolic-header", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h4", { className: "hero__metabolic-title", children: "📊 Your Metabolic Profile" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 464,
                      columnNumber: 45
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "hero__metabolic-subtitle", children: "Understanding your body's energy needs" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 465,
                      columnNumber: 45
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 463,
                    columnNumber: 41
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__metabolic-visual", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__energy-flow", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__energy-node hero__energy-node--bmr", children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__energy-pulse" }, void 0, false, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 472,
                          columnNumber: 53
                        }, globalThis),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__energy-icon", children: "🔥" }, void 0, false, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 473,
                          columnNumber: 53
                        }, globalThis),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__energy-label", children: "BMR" }, void 0, false, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 474,
                          columnNumber: 53
                        }, globalThis),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__energy-value", children: Math.round(((_c = calorieData.calculation) == null ? void 0 : _c.bmr) || 0) }, void 0, false, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 475,
                          columnNumber: 53
                        }, globalThis)
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 471,
                        columnNumber: 49
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__energy-arrow", children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__energy-line" }, void 0, false, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 479,
                          columnNumber: 53
                        }, globalThis),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__energy-tip" }, void 0, false, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 480,
                          columnNumber: 53
                        }, globalThis),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__energy-multiplier", children: [
                          "x ",
                          ((_d = calorieData.calculation) == null ? void 0 : _d.tdee) && ((_e = calorieData.calculation) == null ? void 0 : _e.bmr) ? (calorieData.calculation.tdee / calorieData.calculation.bmr).toFixed(2) : "1.0"
                        ] }, void 0, true, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 481,
                          columnNumber: 53
                        }, globalThis)
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 478,
                        columnNumber: 49
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__energy-node hero__energy-node--tdee", children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__energy-pulse hero__energy-pulse--delayed" }, void 0, false, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 485,
                          columnNumber: 53
                        }, globalThis),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__energy-icon", children: "⚡" }, void 0, false, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 486,
                          columnNumber: 53
                        }, globalThis),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__energy-label", children: "TDEE" }, void 0, false, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 487,
                          columnNumber: 53
                        }, globalThis),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__energy-value", children: Math.round(((_f = calorieData.calculation) == null ? void 0 : _f.tdee) || 0) }, void 0, false, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 488,
                          columnNumber: 53
                        }, globalThis)
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 484,
                        columnNumber: 49
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 470,
                      columnNumber: 45
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__metabolic-insights", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__insight-item", children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__insight-icon", children: "🛌" }, void 0, false, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 495,
                          columnNumber: 53
                        }, globalThis),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__insight-text", children: [
                          "At rest: ",
                          Math.round(((_g = calorieData.calculation) == null ? void 0 : _g.bmr) || 0),
                          " cal/day"
                        ] }, void 0, true, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 496,
                          columnNumber: 53
                        }, globalThis)
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 494,
                        columnNumber: 49
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__insight-item", children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__insight-icon", children: "🏃‍♂️" }, void 0, false, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 499,
                          columnNumber: 53
                        }, globalThis),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__insight-text", children: [
                          "Active: +",
                          Math.round((((_h = calorieData.calculation) == null ? void 0 : _h.tdee) || 0) - (((_i = calorieData.calculation) == null ? void 0 : _i.bmr) || 0)),
                          " cal/day"
                        ] }, void 0, true, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 500,
                          columnNumber: 53
                        }, globalThis)
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 498,
                        columnNumber: 49
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__insight-item", children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__insight-icon", children: "🎯" }, void 0, false, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 503,
                          columnNumber: 53
                        }, globalThis),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__insight-text", children: [
                          "Target: ",
                          calorieData.targetCalories,
                          " cal/day"
                        ] }, void 0, true, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                          lineNumber: 504,
                          columnNumber: 53
                        }, globalThis)
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 502,
                        columnNumber: 49
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 493,
                      columnNumber: 45
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 468,
                    columnNumber: 41
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                  lineNumber: 462,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-overview", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-card hero__calorie-card--target", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-label", children: "Target Calories" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 512,
                      columnNumber: 45
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-value", children: calorieData.targetCalories.toLocaleString() }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 513,
                      columnNumber: 45
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-subtext", children: (_j = calorieData.recommendation) == null ? void 0 : _j.weeklyGoal }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 514,
                      columnNumber: 45
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 511,
                    columnNumber: 41
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-card hero__calorie-card--current", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-label", children: "Current Intake" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 520,
                      columnNumber: 45
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-value", children: calorieData.currentCalories.toLocaleString() }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 521,
                      columnNumber: 45
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-subtext", children: calorieData.remainingCalories > 0 ? `${calorieData.remainingCalories} remaining` : `${Math.abs(calorieData.remainingCalories)} over` }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 522,
                      columnNumber: 45
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 519,
                    columnNumber: 41
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-card hero__calorie-card--progress", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-label", children: "Progress" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 531,
                      columnNumber: 45
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-value", children: [
                      calorieData.percentageConsumed,
                      "%"
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 532,
                      columnNumber: 45
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__calorie-progress-bar", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className: "hero__calorie-progress-fill",
                        style: { width: `${Math.min(calorieData.percentageConsumed, 100)}%` }
                      },
                      void 0,
                      false,
                      {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 534,
                        columnNumber: 49
                      },
                      globalThis
                    ) }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 533,
                      columnNumber: 45
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 530,
                    columnNumber: 41
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                  lineNumber: 510,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                lineNumber: 460,
                columnNumber: 33
              }, globalThis) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__setup-profile", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__setup-icon", children: "⚙️" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                  lineNumber: 544,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "hero__setup-message", children: "Complete your profile to see personalized calorie targets" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                  lineNumber: 545,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "button",
                  {
                    className: "hero__setup-btn",
                    onClick: () => window.location.href = "/profile",
                    children: "Setup Profile"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 548,
                    columnNumber: 37
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                lineNumber: 543,
                columnNumber: 33
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
              lineNumber: 268,
              columnNumber: 25
            }, globalThis)
          ) }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
            lineNumber: 240,
            columnNumber: 17
          }, globalThis) }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
            lineNumber: 239,
            columnNumber: 13
          }, globalThis)
        },
        void 0,
        false,
        {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
          lineNumber: 232,
          columnNumber: 9
        },
        globalThis
      );
    };
    const AddMeals$1 = "";
    const AddMeals = () => {
      const pageRef = reactExports.useRef(null);
      const { setCurrentSection } = useContentManager();
      const { todaysMeals, calorieData, refreshData } = useCalorieTracker();
      const { user } = useAuth();
      const [searchQuery, setSearchQuery] = reactExports.useState("");
      const [selectedMealType, setSelectedMealType] = reactExports.useState("breakfast");
      const [showQuickAdd, setShowQuickAdd] = reactExports.useState(false);
      const [showCustomEntry, setShowCustomEntry] = reactExports.useState(false);
      const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
      const [submitMessage, setSubmitMessage] = reactExports.useState(null);
      const [autocompleteQuery, setAutocompleteQuery] = reactExports.useState("");
      const [searchResults, setSearchResults] = reactExports.useState([]);
      const [showAutocomplete, setShowAutocomplete] = reactExports.useState(false);
      const [selectedMealTypeForSearch, setSelectedMealTypeForSearch] = reactExports.useState("breakfast");
      const [isSearching, setIsSearching] = reactExports.useState(false);
      const autocompleteRef = reactExports.useRef(null);
      const [customMealForm, setCustomMealForm] = reactExports.useState({
        mealName: "",
        mealType: "breakfast",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        fiber: "",
        sugar: "",
        sodium: "",
        notes: "",
        time: "",
        saveMeal: false
      });
      const nutritionSummary = {
        totalCalories: calorieData.currentCalories,
        totalProtein: todaysMeals.reduce((sum, meal) => sum + meal.protein, 0),
        totalCarbs: todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0),
        totalFat: todaysMeals.reduce((sum, meal) => sum + meal.fat, 0),
        goalCalories: calorieData.targetCalories,
        goalProtein: Math.round(calorieData.targetCalories * 0.3 / 4),
        // 30% of calories from protein
        goalCarbs: Math.round(calorieData.targetCalories * 0.45 / 4),
        // 45% of calories from carbs
        goalFat: Math.round(calorieData.targetCalories * 0.25 / 9)
        // 25% of calories from fat
      };
      const quickAddFoods = [
        { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
        { name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
        { name: "Brown Rice (1 cup)", calories: 216, protein: 5, carbs: 45, fat: 1.8 },
        { name: "Greek Yogurt", calories: 100, protein: 17, carbs: 6, fat: 0 },
        { name: "Almonds (28g)", calories: 164, protein: 6, carbs: 6, fat: 14 },
        { name: "Avocado (half)", calories: 160, protein: 2, carbs: 8.5, fat: 15 },
        { name: "Oatmeal (1 cup)", calories: 154, protein: 6, carbs: 28, fat: 3 },
        { name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 }
      ];
      reactExports.useEffect(() => {
        setCurrentSection("add-meals");
      }, [setCurrentSection]);
      const debouncedSearch = reactExports.useCallback(
        (query) => __async(exports, null, function* () {
          if (!query.trim() || !user) {
            setSearchResults([]);
            setShowAutocomplete(false);
            return;
          }
          setIsSearching(true);
          try {
            const { data, error } = yield SupabaseService$1.searchFoodsAndCustomMeals(user.id, query.trim(), 5);
            if (error) {
              console.error("Search error:", error);
              setSearchResults([]);
            } else {
              setSearchResults(data);
              setShowAutocomplete(data.length > 0);
            }
          } catch (error) {
            console.error("Search failed:", error);
            setSearchResults([]);
          } finally {
            setIsSearching(false);
          }
        }),
        [user]
      );
      reactExports.useEffect(() => {
        const timer = setTimeout(() => {
          if (autocompleteQuery.length >= 2) {
            debouncedSearch(autocompleteQuery);
          } else {
            setSearchResults([]);
            setShowAutocomplete(false);
          }
        }, 300);
        return () => clearTimeout(timer);
      }, [autocompleteQuery, debouncedSearch]);
      reactExports.useEffect(() => {
        const handleClickOutside = (event) => {
          if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
            setShowAutocomplete(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);
      const addMeal = (food) => __async(exports, null, function* () {
        console.log("Adding meal to database:", {
          name: food.name,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          mealType: selectedMealType
        });
        yield refreshData();
        setShowQuickAdd(false);
      });
      const addMealFromSearch = (searchResult) => __async(exports, null, function* () {
        if (!user)
          return;
        try {
          const currentDate = /* @__PURE__ */ new Date();
          const dateStr = currentDate.toISOString().split("T")[0];
          const timeStr = currentDate.toTimeString().split(" ")[0].substring(0, 5);
          const calories = Math.round(searchResult.calories_per_100g);
          const protein = searchResult.protein_g;
          const carbs = searchResult.carbohydrates_g;
          const fat = searchResult.fats_g;
          const fiber = searchResult.fiber_g || 0;
          const sugar = searchResult.free_sugar_g || 0;
          const sodium = searchResult.sodium_mg || 0;
          const mealData = {
            user_id: user.id,
            meal_type: selectedMealTypeForSearch,
            meal_name: searchResult.name,
            date: dateStr,
            time: timeStr,
            foods: {
              [searchResult.source]: {
                id: searchResult.id,
                name: searchResult.name,
                calories,
                protein,
                carbs,
                fat,
                fiber,
                sugar,
                sodium,
                serving: "100g"
              }
            },
            total_calories: calories,
            total_protein_g: protein,
            total_carbs_g: carbs,
            total_fat_g: fat,
            total_fiber_g: fiber,
            total_sugar_g: sugar,
            total_sodium_mg: sodium
          };
          const { error } = yield SupabaseService$1.addMeal(mealData);
          if (error) {
            console.error("Error adding meal from search:", error);
            setSubmitMessage({ text: "Failed to add meal. Please try again.", type: "error" });
          } else {
            setSubmitMessage({ text: `${searchResult.name} added successfully!`, type: "success" });
            setAutocompleteQuery("");
            setShowAutocomplete(false);
            yield refreshData();
            setTimeout(() => {
              setSubmitMessage(null);
            }, 3e3);
          }
        } catch (error) {
          console.error("Error adding meal from search:", error);
          setSubmitMessage({ text: "An unexpected error occurred. Please try again.", type: "error" });
        }
      });
      const removeMeal = (mealId) => __async(exports, null, function* () {
        console.log("Removing meal from database:", mealId);
        yield refreshData();
      });
      const filteredFoods = quickAddFoods.filter(
        (food) => food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const getMealsByType = (type) => {
        return todaysMeals.filter((meal) => meal.mealType === type);
      };
      const getProgressPercentage2 = (current, goal) => {
        return Math.min(current / goal * 100, 100);
      };
      const handleCustomMealSubmit = (e) => __async(exports, null, function* () {
        e.preventDefault();
        if (!user) {
          setSubmitMessage({ text: "Please log in to add meals", type: "error" });
          return;
        }
        if (!customMealForm.mealName.trim() || !customMealForm.calories) {
          setSubmitMessage({ text: "Please fill in meal name and calories", type: "error" });
          return;
        }
        setIsSubmitting(true);
        setSubmitMessage(null);
        try {
          const calories = parseFloat(customMealForm.calories) || 0;
          const protein = parseFloat(customMealForm.protein) || 0;
          const carbs = parseFloat(customMealForm.carbs) || 0;
          const fat = parseFloat(customMealForm.fat) || 0;
          const fiber = parseFloat(customMealForm.fiber) || 0;
          const sugar = parseFloat(customMealForm.sugar) || 0;
          const sodium = parseFloat(customMealForm.sodium) || 0;
          const currentDate = /* @__PURE__ */ new Date();
          const dateStr = currentDate.toISOString().split("T")[0];
          const timeStr = customMealForm.time || currentDate.toTimeString().split(" ")[0].substring(0, 5);
          const mealData = {
            user_id: user.id,
            meal_type: customMealForm.mealType,
            meal_name: customMealForm.mealName.trim(),
            date: dateStr,
            time: timeStr,
            foods: {
              custom: {
                name: customMealForm.mealName.trim(),
                calories,
                protein,
                carbs,
                fat,
                fiber,
                sugar,
                sodium,
                notes: customMealForm.notes
              }
            },
            total_calories: Math.round(calories),
            total_protein_g: protein,
            total_carbs_g: carbs,
            total_fat_g: fat,
            total_fiber_g: fiber,
            total_sugar_g: sugar,
            total_sodium_mg: sodium,
            notes: customMealForm.notes
          };
          const { error: mealError } = yield SupabaseService$1.addMeal(mealData);
          if (mealError) {
            console.error("Error adding meal:", mealError);
            setSubmitMessage({ text: "Failed to add meal. Please try again.", type: "error" });
            return;
          }
          if (customMealForm.saveMeal) {
            const { exists, error: checkError } = yield SupabaseService$1.checkCustomMealExists(
              user.id,
              customMealForm.mealName.trim(),
              calories,
              protein,
              carbs,
              fat
            );
            if (checkError) {
              console.error("Error checking custom meal existence:", checkError);
              setSubmitMessage({ text: "Meal added, but failed to save for future reference", type: "info" });
            } else if (exists) {
              setSubmitMessage({ text: "Meal added! This meal is already saved for future reference.", type: "success" });
            } else {
              const customMealData = {
                name: customMealForm.mealName.trim(),
                calories_per_100g: calories,
                protein_g: protein,
                carbohydrates_g: carbs,
                fats_g: fat,
                fiber_g: fiber,
                free_sugar_g: sugar,
                sodium_mg: sodium,
                submitted_by: user.id,
                status: "pending"
              };
              const { error: customMealError } = yield SupabaseService$1.addCustomMeal(customMealData);
              if (customMealError) {
                console.error("Error adding custom meal:", customMealError);
                setSubmitMessage({ text: "Meal added, but failed to save for future reference", type: "info" });
              } else {
                setSubmitMessage({ text: "Meal added successfully and saved for future reference!", type: "success" });
              }
            }
          } else {
            setSubmitMessage({ text: "Meal added successfully!", type: "success" });
          }
          setCustomMealForm({
            mealName: "",
            mealType: "breakfast",
            calories: "",
            protein: "",
            carbs: "",
            fat: "",
            fiber: "",
            sugar: "",
            sodium: "",
            notes: "",
            time: "",
            saveMeal: false
          });
          yield refreshData();
          setTimeout(() => {
            setSubmitMessage(null);
          }, 3e3);
        } catch (error) {
          console.error("Error submitting custom meal:", error);
          setSubmitMessage({ text: "An unexpected error occurred. Please try again.", type: "error" });
        } finally {
          setIsSubmitting(false);
        }
      });
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { ref: pageRef, id: "add-meals", className: "add-meals", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__container", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__search-section", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__search-container", ref: autocompleteRef, children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__search-input-row", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "input",
                {
                  type: "text",
                  placeholder: "Search foods and meals...",
                  value: autocompleteQuery,
                  onChange: (e) => {
                    setAutocompleteQuery(e.target.value);
                    if (e.target.value.length >= 2) {
                      setShowAutocomplete(true);
                    }
                  },
                  onFocus: () => {
                    if (autocompleteQuery.length >= 2 && searchResults.length > 0) {
                      setShowAutocomplete(true);
                    }
                  },
                  className: "add-meals__autocomplete-input"
                },
                void 0,
                false,
                {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 440,
                  columnNumber: 29
                },
                globalThis
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "select",
                {
                  value: selectedMealTypeForSearch,
                  onChange: (e) => setSelectedMealTypeForSearch(e.target.value),
                  className: "add-meals__meal-type-select",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "breakfast", children: "🌅 Breakfast" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                      lineNumber: 462,
                      columnNumber: 33
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "lunch", children: "☀️ Lunch" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                      lineNumber: 463,
                      columnNumber: 33
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "dinner", children: "🌙 Dinner" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                      lineNumber: 464,
                      columnNumber: 33
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "snack", children: "🍿 Snack" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                      lineNumber: 465,
                      columnNumber: 33
                    }, globalThis)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 457,
                  columnNumber: 29
                },
                globalThis
              )
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 439,
              columnNumber: 25
            }, globalThis),
            showAutocomplete && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__autocomplete-dropdown", children: isSearching ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__autocomplete-loading", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Searching..." }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 474,
              columnNumber: 41
            }, globalThis) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 473,
              columnNumber: 37
            }, globalThis) : searchResults.length > 0 ? searchResults.map((result) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "add-meals__autocomplete-item",
                onClick: () => addMealFromSearch(result),
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__autocomplete-item-content", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__autocomplete-item-header", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "add-meals__autocomplete-item-name", children: result.name }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                        lineNumber: 485,
                        columnNumber: 53
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "add-meals__autocomplete-item-source", children: result.source === "custom_meals" ? "👤 Custom" : "🍎 Standard" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                        lineNumber: 486,
                        columnNumber: 53
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                      lineNumber: 484,
                      columnNumber: 49
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__autocomplete-item-nutrition", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                        Math.round(result.calories_per_100g),
                        " cal"
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                        lineNumber: 491,
                        columnNumber: 53
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                        result.protein_g,
                        "g protein"
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                        lineNumber: 492,
                        columnNumber: 53
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                        result.carbohydrates_g,
                        "g carbs"
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                        lineNumber: 493,
                        columnNumber: 53
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                        result.fats_g,
                        "g fat"
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                        lineNumber: 494,
                        columnNumber: 53
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                      lineNumber: 490,
                      columnNumber: 49
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 483,
                    columnNumber: 45
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { className: "add-meals__autocomplete-add-btn", children: "+" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 497,
                    columnNumber: 45
                  }, globalThis)
                ]
              },
              `${result.source}-${result.id}`,
              true,
              {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 478,
                columnNumber: 41
              },
              globalThis
            )) : autocompleteQuery.length >= 2 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__autocomplete-empty", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
              'No foods found for "',
              autocompleteQuery,
              '"'
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 504,
              columnNumber: 41
            }, globalThis) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 503,
              columnNumber: 37
            }, globalThis) : null }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 471,
              columnNumber: 29
            }, globalThis)
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 438,
            columnNumber: 21
          }, globalThis),
          submitMessage && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: `add-meals__message add-meals__message--${submitMessage.type}`, children: submitMessage.text }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 513,
            columnNumber: 25
          }, globalThis)
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
          lineNumber: 437,
          columnNumber: 17
        }, globalThis),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__quick-actions", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "button",
            {
              className: "add-meals__quick-btn add-meals__quick-btn--primary",
              onClick: () => setShowQuickAdd(!showQuickAdd),
              children: "🍎 Quick Add Food"
            },
            void 0,
            false,
            {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 521,
              columnNumber: 21
            },
            globalThis
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "button",
            {
              className: "add-meals__quick-btn",
              onClick: () => setShowCustomEntry(!showCustomEntry),
              children: "📊 Custom Entry"
            },
            void 0,
            false,
            {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 527,
              columnNumber: 21
            },
            globalThis
          )
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
          lineNumber: 520,
          columnNumber: 17
        }, globalThis),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__nutrition-summary", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "add-meals__section-title", children: "Today's Nutrition" }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 537,
            columnNumber: 21
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__nutrition-visual", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__macro-circle", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-container", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("svg", { className: "add-meals__circle-svg", width: "100", height: "100", viewBox: "0 0 36 36", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "path",
                  {
                    className: "add-meals__circle-bg",
                    d: "M18 2.0845\r\n                                           a 15.9155 15.9155 0 0 1 0 31.831\r\n                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 543,
                    columnNumber: 37
                  },
                  globalThis
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "path",
                  {
                    className: "add-meals__circle-progress add-meals__circle-progress--calories",
                    strokeDasharray: `${getProgressPercentage2(nutritionSummary.totalCalories, nutritionSummary.goalCalories)}, 100`,
                    d: "M18 2.0845\r\n                                           a 15.9155 15.9155 0 0 1 0 31.831\r\n                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 548,
                    columnNumber: 37
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 542,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-content", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-icon", children: "🔥" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 556,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-value", children: Math.round(nutritionSummary.totalCalories) }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 557,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-label", children: "Calories" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 558,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 555,
                columnNumber: 33
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 541,
              columnNumber: 29
            }, globalThis) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 540,
              columnNumber: 25
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__macro-circle", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-container", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("svg", { className: "add-meals__circle-svg", width: "100", height: "100", viewBox: "0 0 36 36", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "path",
                  {
                    className: "add-meals__circle-bg",
                    d: "M18 2.0845\r\n                                           a 15.9155 15.9155 0 0 1 0 31.831\r\n                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 567,
                    columnNumber: 37
                  },
                  globalThis
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "path",
                  {
                    className: "add-meals__circle-progress add-meals__circle-progress--protein",
                    strokeDasharray: `${getProgressPercentage2(nutritionSummary.totalProtein, nutritionSummary.goalProtein)}, 100`,
                    d: "M18 2.0845\r\n                                           a 15.9155 15.9155 0 0 1 0 31.831\r\n                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 572,
                    columnNumber: 37
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 566,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-content", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-icon", children: "💪" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 580,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-value", children: [
                  Math.round(nutritionSummary.totalProtein),
                  "g"
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 581,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-label", children: "Protein" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 582,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 579,
                columnNumber: 33
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 565,
              columnNumber: 29
            }, globalThis) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 564,
              columnNumber: 25
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__macro-circle", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-container", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("svg", { className: "add-meals__circle-svg", width: "100", height: "100", viewBox: "0 0 36 36", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "path",
                  {
                    className: "add-meals__circle-bg",
                    d: "M18 2.0845\r\n                                           a 15.9155 15.9155 0 0 1 0 31.831\r\n                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 591,
                    columnNumber: 37
                  },
                  globalThis
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "path",
                  {
                    className: "add-meals__circle-progress add-meals__circle-progress--carbs",
                    strokeDasharray: `${getProgressPercentage2(nutritionSummary.totalCarbs, nutritionSummary.goalCarbs)}, 100`,
                    d: "M18 2.0845\r\n                                           a 15.9155 15.9155 0 0 1 0 31.831\r\n                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 596,
                    columnNumber: 37
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 590,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-content", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-icon", children: "🌾" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 604,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-value", children: [
                  Math.round(nutritionSummary.totalCarbs),
                  "g"
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 605,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-label", children: "Carbs" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 606,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 603,
                columnNumber: 33
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 589,
              columnNumber: 29
            }, globalThis) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 588,
              columnNumber: 25
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__macro-circle", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-container", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("svg", { className: "add-meals__circle-svg", width: "100", height: "100", viewBox: "0 0 36 36", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "path",
                  {
                    className: "add-meals__circle-bg",
                    d: "M18 2.0845\r\n                                           a 15.9155 15.9155 0 0 1 0 31.831\r\n                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 615,
                    columnNumber: 37
                  },
                  globalThis
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "path",
                  {
                    className: "add-meals__circle-progress add-meals__circle-progress--fat",
                    strokeDasharray: `${getProgressPercentage2(nutritionSummary.totalFat, nutritionSummary.goalFat)}, 100`,
                    d: "M18 2.0845\r\n                                           a 15.9155 15.9155 0 0 1 0 31.831\r\n                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 620,
                    columnNumber: 37
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 614,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-content", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-icon", children: "🥑" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 628,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-value", children: [
                  Math.round(nutritionSummary.totalFat),
                  "g"
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 629,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-label", children: "Fat" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 630,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 627,
                columnNumber: 33
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 613,
              columnNumber: 29
            }, globalThis) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 612,
              columnNumber: 25
            }, globalThis)
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 538,
            columnNumber: 21
          }, globalThis)
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
          lineNumber: 536,
          columnNumber: 17
        }, globalThis),
        showQuickAdd && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__quick-add-panel", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__panel-header", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "add-meals__panel-title", children: "Quick Add Foods" }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 641,
              columnNumber: 29
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                className: "add-meals__close-btn",
                onClick: () => setShowQuickAdd(false),
                children: "✕"
              },
              void 0,
              false,
              {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 642,
                columnNumber: 29
              },
              globalThis
            )
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 640,
            columnNumber: 25
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__meal-type-selector", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "add-meals__meal-label", children: "Meal Type:" }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 651,
              columnNumber: 29
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "select",
              {
                value: selectedMealType,
                onChange: (e) => setSelectedMealType(e.target.value),
                className: "add-meals__meal-select",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "breakfast", children: "🌅 Breakfast" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 657,
                    columnNumber: 33
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "lunch", children: "☀️ Lunch" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 658,
                    columnNumber: 33
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "dinner", children: "🌙 Dinner" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 659,
                    columnNumber: 33
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "snack", children: "🍿 Snack" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 660,
                    columnNumber: 33
                  }, globalThis)
                ]
              },
              void 0,
              true,
              {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 652,
                columnNumber: 29
              },
              globalThis
            )
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 650,
            columnNumber: 25
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__search-box", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "input",
            {
              type: "text",
              placeholder: "Search foods...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "add-meals__search-input"
            },
            void 0,
            false,
            {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 665,
              columnNumber: 29
            },
            globalThis
          ) }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 664,
            columnNumber: 25
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__foods-grid", children: filteredFoods.map((food, index2) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__food-card", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__food-info", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h4", { className: "add-meals__food-name", children: food.name }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 678,
                columnNumber: 41
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__food-nutrition", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                  food.calories,
                  " cal"
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 680,
                  columnNumber: 45
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                  food.protein,
                  "g protein"
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 681,
                  columnNumber: 45
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 679,
                columnNumber: 41
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 677,
              columnNumber: 37
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                className: "add-meals__add-food-btn",
                onClick: () => addMeal(food),
                children: "+"
              },
              void 0,
              false,
              {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 684,
                columnNumber: 37
              },
              globalThis
            )
          ] }, index2, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 676,
            columnNumber: 33
          }, globalThis)) }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 674,
            columnNumber: 25
          }, globalThis)
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
          lineNumber: 639,
          columnNumber: 21
        }, globalThis),
        showCustomEntry && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__custom-entry-panel", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__panel-header", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "add-meals__panel-title", children: "Custom Meal Entry" }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 700,
              columnNumber: 29
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                className: "add-meals__close-btn",
                onClick: () => setShowCustomEntry(false),
                children: "✕"
              },
              void 0,
              false,
              {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 701,
                columnNumber: 29
              },
              globalThis
            )
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 699,
            columnNumber: 25
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("form", { className: "add-meals__custom-form", onSubmit: handleCustomMealSubmit, children: [
            submitMessage && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: `add-meals__message add-meals__message--${submitMessage.type}`, children: submitMessage.text }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 711,
              columnNumber: 33
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__form-group", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "add-meals__form-label", children: "Meal Name *" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 717,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "input",
                {
                  type: "text",
                  className: "add-meals__form-input",
                  value: customMealForm.mealName,
                  onChange: (e) => setCustomMealForm((prev) => __spreadProps(__spreadValues({}, prev), { mealName: e.target.value })),
                  placeholder: "Enter meal name",
                  required: true
                },
                void 0,
                false,
                {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 718,
                  columnNumber: 33
                },
                globalThis
              )
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 716,
              columnNumber: 29
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__form-group", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "add-meals__form-label", children: "Meal Type *" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 729,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "select",
                {
                  className: "add-meals__form-select",
                  value: customMealForm.mealType,
                  onChange: (e) => setCustomMealForm((prev) => __spreadProps(__spreadValues({}, prev), { mealType: e.target.value })),
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "breakfast", children: "🌅 Breakfast" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                      lineNumber: 735,
                      columnNumber: 37
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "lunch", children: "☀️ Lunch" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                      lineNumber: 736,
                      columnNumber: 37
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "dinner", children: "🌙 Dinner" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                      lineNumber: 737,
                      columnNumber: 37
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "snack", children: "🍿 Snack" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                      lineNumber: 738,
                      columnNumber: 37
                    }, globalThis)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 730,
                  columnNumber: 33
                },
                globalThis
              )
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 728,
              columnNumber: 29
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__form-group", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "add-meals__form-label", children: "Time" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 743,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "input",
                {
                  type: "time",
                  className: "add-meals__form-input",
                  value: customMealForm.time,
                  onChange: (e) => setCustomMealForm((prev) => __spreadProps(__spreadValues({}, prev), { time: e.target.value }))
                },
                void 0,
                false,
                {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 744,
                  columnNumber: 33
                },
                globalThis
              )
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 742,
              columnNumber: 29
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__form-row", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__form-group add-meals__form-group--half", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "add-meals__form-label", children: "Calories *" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 754,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "input",
                  {
                    type: "number",
                    className: "add-meals__form-input",
                    value: customMealForm.calories,
                    onChange: (e) => setCustomMealForm((prev) => __spreadProps(__spreadValues({}, prev), { calories: e.target.value })),
                    placeholder: "0",
                    min: "0",
                    step: "1",
                    required: true
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 755,
                    columnNumber: 37
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 753,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__form-group add-meals__form-group--half", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "add-meals__form-label", children: "Protein (g)" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 768,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "input",
                  {
                    type: "number",
                    className: "add-meals__form-input",
                    value: customMealForm.protein,
                    onChange: (e) => setCustomMealForm((prev) => __spreadProps(__spreadValues({}, prev), { protein: e.target.value })),
                    placeholder: "0",
                    min: "0",
                    step: "0.1"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 769,
                    columnNumber: 37
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 767,
                columnNumber: 33
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 752,
              columnNumber: 29
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__form-row", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__form-group add-meals__form-group--half", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "add-meals__form-label", children: "Carbs (g)" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 783,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "input",
                  {
                    type: "number",
                    className: "add-meals__form-input",
                    value: customMealForm.carbs,
                    onChange: (e) => setCustomMealForm((prev) => __spreadProps(__spreadValues({}, prev), { carbs: e.target.value })),
                    placeholder: "0",
                    min: "0",
                    step: "0.1"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 784,
                    columnNumber: 37
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 782,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__form-group add-meals__form-group--half", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "add-meals__form-label", children: "Fat (g)" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 796,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "input",
                  {
                    type: "number",
                    className: "add-meals__form-input",
                    value: customMealForm.fat,
                    onChange: (e) => setCustomMealForm((prev) => __spreadProps(__spreadValues({}, prev), { fat: e.target.value })),
                    placeholder: "0",
                    min: "0",
                    step: "0.1"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 797,
                    columnNumber: 37
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 795,
                columnNumber: 33
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 781,
              columnNumber: 29
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__form-row", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__form-group add-meals__form-group--half", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "add-meals__form-label", children: "Fiber (g)" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 811,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "input",
                  {
                    type: "number",
                    className: "add-meals__form-input",
                    value: customMealForm.fiber,
                    onChange: (e) => setCustomMealForm((prev) => __spreadProps(__spreadValues({}, prev), { fiber: e.target.value })),
                    placeholder: "0",
                    min: "0",
                    step: "0.1"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 812,
                    columnNumber: 37
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 810,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__form-group add-meals__form-group--half", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "add-meals__form-label", children: "Sugar (g)" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 824,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "input",
                  {
                    type: "number",
                    className: "add-meals__form-input",
                    value: customMealForm.sugar,
                    onChange: (e) => setCustomMealForm((prev) => __spreadProps(__spreadValues({}, prev), { sugar: e.target.value })),
                    placeholder: "0",
                    min: "0",
                    step: "0.1"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 825,
                    columnNumber: 37
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 823,
                columnNumber: 33
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 809,
              columnNumber: 29
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__form-group", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "add-meals__form-label", children: "Sodium (mg)" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 838,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "input",
                {
                  type: "number",
                  className: "add-meals__form-input",
                  value: customMealForm.sodium,
                  onChange: (e) => setCustomMealForm((prev) => __spreadProps(__spreadValues({}, prev), { sodium: e.target.value })),
                  placeholder: "0",
                  min: "0",
                  step: "0.1"
                },
                void 0,
                false,
                {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 839,
                  columnNumber: 33
                },
                globalThis
              )
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 837,
              columnNumber: 29
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__form-group", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "add-meals__form-label", children: "Notes" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 851,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "textarea",
                {
                  className: "add-meals__form-textarea",
                  value: customMealForm.notes,
                  onChange: (e) => setCustomMealForm((prev) => __spreadProps(__spreadValues({}, prev), { notes: e.target.value })),
                  placeholder: "Additional notes about the meal...",
                  rows: 3
                },
                void 0,
                false,
                {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 852,
                  columnNumber: 33
                },
                globalThis
              )
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 850,
              columnNumber: 29
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__form-group", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "add-meals__form-checkbox-label", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "input",
                {
                  type: "checkbox",
                  className: "add-meals__form-checkbox",
                  checked: customMealForm.saveMeal,
                  onChange: (e) => setCustomMealForm((prev) => __spreadProps(__spreadValues({}, prev), { saveMeal: e.target.checked }))
                },
                void 0,
                false,
                {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 863,
                  columnNumber: 37
                },
                globalThis
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "add-meals__form-checkbox-text", children: "Save meal for future references" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 869,
                columnNumber: 37
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 862,
              columnNumber: 33
            }, globalThis) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 861,
              columnNumber: 29
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__form-actions", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                type: "submit",
                className: "add-meals__add-meal-btn add-meals__add-meal-btn--primary",
                disabled: isSubmitting,
                children: isSubmitting ? "Adding Meal..." : "Add Meal"
              },
              void 0,
              false,
              {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 876,
                columnNumber: 33
              },
              globalThis
            ) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 875,
              columnNumber: 29
            }, globalThis)
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 709,
            columnNumber: 25
          }, globalThis)
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
          lineNumber: 698,
          columnNumber: 21
        }, globalThis),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__meals-section", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "add-meals__section-title", children: "Today's Meals" }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 890,
            columnNumber: 21
          }, globalThis),
          ["breakfast", "lunch", "dinner", "snack"].map((mealType) => {
            const typeMeals = getMealsByType(mealType);
            const typeCalories = typeMeals.reduce((sum, meal) => sum + meal.calories, 0);
            return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__meal-type-section", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__meal-type-header", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "add-meals__meal-type-title", children: [
                  mealType === "breakfast" && "🌅",
                  mealType === "lunch" && "☀️",
                  mealType === "dinner" && "🌙",
                  mealType === "snack" && "🍿",
                  mealType.charAt(0).toUpperCase() + mealType.slice(1)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 899,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "add-meals__meal-type-calories", children: [
                  Math.round(typeCalories),
                  " calories"
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 906,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 898,
                columnNumber: 33
              }, globalThis),
              typeMeals.length > 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__meal-list", children: typeMeals.map((meal) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__meal-item", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__meal-info", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "add-meals__meal-name", children: meal.name }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 916,
                    columnNumber: 53
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "add-meals__meal-nutrition", children: [
                    meal.calories,
                    " cal • ",
                    meal.protein,
                    "g protein • ",
                    meal.carbs,
                    "g carbs • ",
                    meal.fat,
                    "g fat"
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 917,
                    columnNumber: 53
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 915,
                  columnNumber: 49
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "button",
                  {
                    className: "add-meals__remove-btn",
                    onClick: () => removeMeal(meal.id),
                    children: "🗑️"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 921,
                    columnNumber: 49
                  },
                  globalThis
                )
              ] }, meal.id, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 914,
                columnNumber: 45
              }, globalThis)) }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 912,
                columnNumber: 37
              }, globalThis) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__empty-meal-type", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { children: [
                  "No ",
                  mealType,
                  " entries yet"
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 932,
                  columnNumber: 41
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "button",
                  {
                    className: "add-meals__add-meal-btn",
                    onClick: () => {
                      setSelectedMealType(mealType);
                      setShowQuickAdd(true);
                    },
                    children: [
                      "+ Add ",
                      mealType
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 933,
                    columnNumber: 41
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 931,
                columnNumber: 37
              }, globalThis)
            ] }, mealType, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 897,
              columnNumber: 29
            }, globalThis);
          })
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
          lineNumber: 889,
          columnNumber: 17
        }, globalThis)
      ] }, void 0, true, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
        lineNumber: 434,
        columnNumber: 13
      }, globalThis) }, void 0, false, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
        lineNumber: 433,
        columnNumber: 9
      }, globalThis);
    };
    const Profile$1 = "";
    const Profile = () => {
      const { user, signOut } = useAuth();
      const [profileData, setProfileData] = reactExports.useState({
        height_cm: 0,
        weight_kg: 0,
        target_weight_kg: 0,
        target_duration: 0,
        target_duration_unit: "weeks",
        activity_level: "moderate",
        orientation: "",
        age: 0,
        gender: ""
      });
      const [isEditing, setIsEditing] = reactExports.useState(false);
      const [heightUnit, setHeightUnit] = reactExports.useState("cm");
      const [weightUnit, setWeightUnit] = reactExports.useState("kg");
      const [targetWeightUnit, setTargetWeightUnit] = reactExports.useState("kg");
      const [heightFeet, setHeightFeet] = reactExports.useState(0);
      const [heightInches, setHeightInches] = reactExports.useState(0);
      const [isLoading, setIsLoading] = reactExports.useState(false);
      const [hasProfile, setHasProfile] = reactExports.useState(false);
      const [orientationOptions, setOrientationOptions] = reactExports.useState([]);
      const getUserName = reactExports.useCallback(() => {
        var _a, _b, _c;
        if (!user)
          return "";
        return ((_a = user.user_metadata) == null ? void 0 : _a.full_name) || ((_b = user.user_metadata) == null ? void 0 : _b.name) || ((_c = user.email) == null ? void 0 : _c.split("@")[0]) || "User";
      }, [user]);
      const getUserInitials = reactExports.useCallback(() => {
        var _a, _b;
        if (!(user == null ? void 0 : user.email))
          return "U";
        const email = user.email;
        const name = ((_a = user.user_metadata) == null ? void 0 : _a.full_name) || ((_b = user.user_metadata) == null ? void 0 : _b.name);
        if (name) {
          const nameParts = name.trim().split(" ");
          if (nameParts.length >= 2) {
            return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
          }
          return name[0].toUpperCase();
        }
        return email[0].toUpperCase();
      }, [user]);
      reactExports.useEffect(() => {
        loadUserProfile();
        loadOrientations();
      }, [user]);
      reactExports.useEffect(() => {
        loadOrientations();
      }, [profileData.weight_kg, profileData.target_weight_kg]);
      const loadUserProfile = () => __async(exports, null, function* () {
        if (!user)
          return;
        try {
          const { data } = yield SupabaseService$1.getUserProfile(user.id);
          if (data) {
            setProfileData({
              height_cm: data.height_cm || 0,
              weight_kg: data.weight_kg || 0,
              target_weight_kg: data.target_weight_kg || 0,
              target_duration: data.target_duration || 0,
              target_duration_unit: data.target_duration_unit || "weeks",
              activity_level: data.activity_level || "moderate",
              orientation: data.orientation || "",
              age: data.age || 0,
              gender: data.gender || ""
            });
            setHasProfile(true);
            if (data.height_cm) {
              const feet = Math.floor(data.height_cm / 30.48);
              const inches = Math.round(data.height_cm % 30.48 / 2.54);
              setHeightFeet(feet);
              setHeightInches(inches);
            }
          } else {
            setIsEditing(true);
          }
        } catch (error) {
          console.error("Error loading profile:", error);
        }
      });
      const loadOrientations = () => __async(exports, null, function* () {
        try {
          const currentWeight = profileData.weight_kg;
          const targetWeight = profileData.target_weight_kg;
          let applicableFor = "both";
          if (currentWeight > 0 && targetWeight > 0) {
            if (targetWeight < currentWeight) {
              applicableFor = "weight_loss";
            } else if (targetWeight > currentWeight) {
              applicableFor = "weight_gain";
            }
          }
          const { data, error } = yield SupabaseService$1.getOrientations(applicableFor);
          if (error) {
            console.error("Error loading orientations:", error);
            setOrientationOptions(getOrientationOptionsFallback(applicableFor));
          } else {
            setOrientationOptions(data.map((orientation) => ({
              value: orientation.value,
              label: orientation.label
            })));
          }
        } catch (error) {
          console.error("Error loading orientations:", error);
          const currentWeight = profileData.weight_kg;
          const targetWeight = profileData.target_weight_kg;
          let applicableFor = "both";
          if (currentWeight > 0 && targetWeight > 0) {
            if (targetWeight < currentWeight) {
              applicableFor = "weight_loss";
            } else if (targetWeight > currentWeight) {
              applicableFor = "weight_gain";
            }
          }
          setOrientationOptions(getOrientationOptionsFallback(applicableFor));
        }
      });
      const convertHeight = (feet, inches) => {
        return Math.round(feet * 30.48 + inches * 2.54);
      };
      const convertWeight = (value, from, to) => {
        if (from === to)
          return value;
        if (from === "kg" && to === "lbs")
          return Math.round(value * 2.20462 * 10) / 10;
        if (from === "lbs" && to === "kg")
          return Math.round(value / 2.20462 * 10) / 10;
        return value;
      };
      const handleHeightUnitToggle = () => {
        setHeightUnit((prev) => prev === "cm" ? "ft" : "cm");
      };
      const handleWeightUnitToggle = () => {
        setWeightUnit((prev) => prev === "kg" ? "lbs" : "kg");
      };
      const handleTargetWeightUnitToggle = () => {
        setTargetWeightUnit((prev) => prev === "kg" ? "lbs" : "kg");
      };
      const handleInputChange = (field, value) => {
        setProfileData((prev) => __spreadProps(__spreadValues({}, prev), { [field]: value }));
      };
      const getOrientationOptionsFallback = (applicableFor) => {
        if (applicableFor === "weight_loss") {
          return [
            { value: "energy_focused", label: "Energy Focussed" },
            { value: "muscle_preservation", label: "Muscle Preservation" }
          ];
        } else if (applicableFor === "weight_gain") {
          return [
            { value: "lean_muscle_building", label: "Lean Muscle Building" },
            { value: "energetic_bulking", label: "Energetic Bulking" }
          ];
        }
        return [
          { value: "energy_focused", label: "Energy Focussed" },
          { value: "muscle_preservation", label: "Muscle Preservation" },
          { value: "lean_muscle_building", label: "Lean Muscle Building" },
          { value: "energetic_bulking", label: "Energetic Bulking" }
        ];
      };
      const validateInputs = () => {
        if (heightUnit === "ft") {
          if (heightFeet < 0 || heightFeet > 8 || heightInches < 0 || heightInches >= 12) {
            NotificationManager.getInstance().show("Please enter valid height (0-8 feet, 0-11 inches)", "error");
            return false;
          }
        } else {
          if (profileData.height_cm < 0 || profileData.height_cm > 250) {
            NotificationManager.getInstance().show("Please enter valid height (0-250 cm)", "error");
            return false;
          }
        }
        const weightInKg = weightUnit === "kg" ? profileData.weight_kg : convertWeight(profileData.weight_kg, "lbs", "kg");
        if (weightInKg < 0 || weightInKg > 500) {
          NotificationManager.getInstance().show("Please enter valid weight", "error");
          return false;
        }
        const targetWeightInKg = targetWeightUnit === "kg" ? profileData.target_weight_kg : convertWeight(profileData.target_weight_kg, "lbs", "kg");
        if (targetWeightInKg < 0 || targetWeightInKg > 500) {
          NotificationManager.getInstance().show("Please enter valid target weight", "error");
          return false;
        }
        if (profileData.target_duration <= 0) {
          NotificationManager.getInstance().show("Please enter valid target duration", "error");
          return false;
        }
        if (!profileData.age || profileData.age < 1 || profileData.age > 120) {
          NotificationManager.getInstance().show("Please enter valid age (1-120)", "error");
          return false;
        }
        if (!profileData.gender) {
          NotificationManager.getInstance().show("Please select a gender", "error");
          return false;
        }
        return true;
      };
      const handleSave = () => __async(exports, null, function* () {
        if (!user || !validateInputs())
          return;
        setIsLoading(true);
        try {
          const dataToSave = {};
          if (heightUnit === "ft") {
            dataToSave.height_cm = convertHeight(heightFeet, heightInches);
          } else {
            dataToSave.height_cm = profileData.height_cm;
          }
          if (weightUnit === "lbs") {
            dataToSave.weight_kg = convertWeight(profileData.weight_kg, "lbs", "kg");
          } else {
            dataToSave.weight_kg = profileData.weight_kg;
          }
          if (targetWeightUnit === "lbs") {
            dataToSave.target_weight_kg = convertWeight(profileData.target_weight_kg, "lbs", "kg");
          } else {
            dataToSave.target_weight_kg = profileData.target_weight_kg;
          }
          dataToSave.activity_level = profileData.activity_level;
          dataToSave.target_duration = profileData.target_duration;
          dataToSave.target_duration_unit = profileData.target_duration_unit;
          dataToSave.orientation = profileData.orientation;
          dataToSave.age = profileData.age;
          dataToSave.gender = profileData.gender;
          const { error } = yield SupabaseService$1.updateUserProfile(user.id, dataToSave);
          if (error) {
            throw error;
          }
          NotificationManager.getInstance().show("Profile updated successfully!", "success");
          setIsEditing(false);
          setHasProfile(true);
        } catch (error) {
          console.error("Error saving profile:", error);
          NotificationManager.getInstance().show(error.message || "Failed to save profile", "error");
        } finally {
          setIsLoading(false);
        }
      });
      const handleCancel = () => {
        loadUserProfile();
        setIsEditing(false);
      };
      const handleSignOut = () => __async(exports, null, function* () {
        try {
          yield signOut();
        } catch (error) {
          console.error("Sign out error:", error);
          NotificationManager.getInstance().show("Failed to sign out", "error");
        }
      });
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__container", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__header", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__user", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__avatar", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "profile__initials", children: getUserInitials() }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 343,
              columnNumber: 29
            }, globalThis) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 342,
              columnNumber: 25
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "profile__info", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "profile__name", children: getUserName() }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 348,
                columnNumber: 29
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "profile__email", children: user == null ? void 0 : user.email }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 349,
                columnNumber: 29
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 347,
              columnNumber: 25
            }, globalThis)
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
            lineNumber: 341,
            columnNumber: 21
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "button",
            {
              className: "profile__signout-btn",
              onClick: handleSignOut,
              type: "button",
              children: "Sign Out"
            },
            void 0,
            false,
            {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 352,
              columnNumber: 21
            },
            globalThis
          )
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
          lineNumber: 340,
          columnNumber: 17
        }, globalThis),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__content", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__section", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__section-header", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { children: "Setup Profile" }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 364,
              columnNumber: 29
            }, globalThis),
            !isEditing && hasProfile && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                className: "profile__edit-btn",
                onClick: () => setIsEditing(true),
                children: "Edit"
              },
              void 0,
              false,
              {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 366,
                columnNumber: 33
              },
              globalThis
            )
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
            lineNumber: 363,
            columnNumber: 25
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__form", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__row", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-group", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-header", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { children: "Height" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 379,
                    columnNumber: 41
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "button",
                    {
                      type: "button",
                      className: "profile__unit-toggle",
                      onClick: handleHeightUnitToggle,
                      disabled: !isEditing,
                      children: heightUnit === "cm" ? "ft/in" : "cm"
                    },
                    void 0,
                    false,
                    {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 380,
                      columnNumber: 41
                    },
                    globalThis
                  )
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 378,
                  columnNumber: 37
                }, globalThis),
                heightUnit === "cm" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__input-group", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "input",
                    {
                      id: "height-cm",
                      name: "height-cm",
                      type: "number",
                      min: "0",
                      max: "250",
                      value: profileData.height_cm,
                      onChange: (e) => handleInputChange("height_cm", parseInt(e.target.value) || 0),
                      disabled: !isEditing,
                      placeholder: "Height in cm"
                    },
                    void 0,
                    false,
                    {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 391,
                      columnNumber: 45
                    },
                    globalThis
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "profile__unit", children: "cm" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 402,
                    columnNumber: 45
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 390,
                  columnNumber: 41
                }, globalThis) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__height-row", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__input-group", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "input",
                      {
                        id: "height-feet",
                        name: "height-feet",
                        type: "number",
                        min: "0",
                        max: "8",
                        value: heightFeet,
                        onChange: (e) => {
                          const feet = parseInt(e.target.value) || 0;
                          setHeightFeet(feet);
                          handleInputChange("height_cm", convertHeight(feet, heightInches));
                        },
                        disabled: !isEditing,
                        placeholder: "Feet"
                      },
                      void 0,
                      false,
                      {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                        lineNumber: 407,
                        columnNumber: 49
                      },
                      globalThis
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "profile__unit", children: "ft" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 422,
                      columnNumber: 49
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 406,
                    columnNumber: 45
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__input-group", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "input",
                      {
                        id: "height-inches",
                        name: "height-inches",
                        type: "number",
                        min: "0",
                        max: "11",
                        value: heightInches,
                        onChange: (e) => {
                          const inches = parseInt(e.target.value) || 0;
                          setHeightInches(inches);
                          handleInputChange("height_cm", convertHeight(heightFeet, inches));
                        },
                        disabled: !isEditing,
                        placeholder: "Inches"
                      },
                      void 0,
                      false,
                      {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                        lineNumber: 425,
                        columnNumber: 49
                      },
                      globalThis
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "profile__unit", children: "in" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 440,
                      columnNumber: 49
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 424,
                    columnNumber: 45
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 405,
                  columnNumber: 41
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 377,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-group", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-header", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { children: "Weight" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 448,
                    columnNumber: 41
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "button",
                    {
                      type: "button",
                      className: "profile__unit-toggle",
                      onClick: handleWeightUnitToggle,
                      disabled: !isEditing,
                      children: weightUnit === "kg" ? "lbs" : "kg"
                    },
                    void 0,
                    false,
                    {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 449,
                      columnNumber: 41
                    },
                    globalThis
                  )
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 447,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__input-group", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "input",
                    {
                      id: "weight",
                      name: "weight",
                      type: "number",
                      min: "0",
                      max: weightUnit === "kg" ? "500" : "1100",
                      step: "0.1",
                      value: weightUnit === "kg" ? profileData.weight_kg : convertWeight(profileData.weight_kg, "kg", "lbs"),
                      onChange: (e) => {
                        const value = parseFloat(e.target.value) || 0;
                        handleInputChange("weight_kg", weightUnit === "kg" ? value : convertWeight(value, "lbs", "kg"));
                      },
                      disabled: !isEditing,
                      placeholder: `Weight in ${weightUnit}`
                    },
                    void 0,
                    false,
                    {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 459,
                      columnNumber: 41
                    },
                    globalThis
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "profile__unit", children: weightUnit }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 474,
                    columnNumber: 41
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 458,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 446,
                columnNumber: 33
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 376,
              columnNumber: 29
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__row", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-group", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-header", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { children: "Target Weight" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 482,
                    columnNumber: 41
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "button",
                    {
                      type: "button",
                      className: "profile__unit-toggle",
                      onClick: handleTargetWeightUnitToggle,
                      disabled: !isEditing,
                      children: targetWeightUnit === "kg" ? "lbs" : "kg"
                    },
                    void 0,
                    false,
                    {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 483,
                      columnNumber: 41
                    },
                    globalThis
                  )
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 481,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__input-group", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "input",
                    {
                      id: "target-weight",
                      name: "target-weight",
                      type: "number",
                      min: "0",
                      max: targetWeightUnit === "kg" ? "500" : "1100",
                      step: "0.1",
                      value: targetWeightUnit === "kg" ? profileData.target_weight_kg : convertWeight(profileData.target_weight_kg, "kg", "lbs"),
                      onChange: (e) => {
                        const value = parseFloat(e.target.value) || 0;
                        handleInputChange("target_weight_kg", targetWeightUnit === "kg" ? value : convertWeight(value, "lbs", "kg"));
                      },
                      disabled: !isEditing,
                      placeholder: `Target weight in ${targetWeightUnit}`
                    },
                    void 0,
                    false,
                    {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 493,
                      columnNumber: 41
                    },
                    globalThis
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "profile__unit", children: targetWeightUnit }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 508,
                    columnNumber: 41
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 492,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 480,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-group", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-header", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { children: "Target Duration" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 514,
                  columnNumber: 41
                }, globalThis) }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 513,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__duration-row", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__input-group", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "input",
                    {
                      id: "target-duration",
                      name: "target-duration",
                      type: "number",
                      min: "1",
                      max: "999",
                      value: profileData.target_duration,
                      onChange: (e) => handleInputChange("target_duration", parseInt(e.target.value) || 0),
                      disabled: !isEditing,
                      placeholder: "Duration"
                    },
                    void 0,
                    false,
                    {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 518,
                      columnNumber: 45
                    },
                    globalThis
                  ) }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 517,
                    columnNumber: 41
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "select",
                    {
                      id: "target-duration-unit",
                      name: "target-duration-unit",
                      value: profileData.target_duration_unit,
                      onChange: (e) => handleInputChange("target_duration_unit", e.target.value),
                      disabled: !isEditing,
                      className: "profile__select profile__duration-unit",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "days", children: "Days" }, void 0, false, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                          lineNumber: 538,
                          columnNumber: 45
                        }, globalThis),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "weeks", children: "Weeks" }, void 0, false, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                          lineNumber: 539,
                          columnNumber: 45
                        }, globalThis),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "months", children: "Months" }, void 0, false, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                          lineNumber: 540,
                          columnNumber: 45
                        }, globalThis)
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 530,
                      columnNumber: 41
                    },
                    globalThis
                  )
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 516,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 512,
                columnNumber: 33
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 479,
              columnNumber: 29
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__row", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-group", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-header", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { children: "Age" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 549,
                columnNumber: 41
              }, globalThis) }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 548,
                columnNumber: 37
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__input-group", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "input",
                  {
                    id: "age",
                    name: "age",
                    type: "number",
                    min: "1",
                    max: "120",
                    value: profileData.age,
                    onChange: (e) => handleInputChange("age", parseInt(e.target.value) || 0),
                    disabled: !isEditing,
                    placeholder: "Age"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 552,
                    columnNumber: 41
                  },
                  globalThis
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "profile__unit", children: "years" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 563,
                  columnNumber: 41
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 551,
                columnNumber: 37
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 547,
              columnNumber: 33
            }, globalThis) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 546,
              columnNumber: 29
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__row", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-group", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-header", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { children: "Gender" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 571,
                columnNumber: 41
              }, globalThis) }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 570,
                columnNumber: 37
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "select",
                {
                  id: "gender",
                  name: "gender",
                  value: profileData.gender,
                  onChange: (e) => handleInputChange("gender", e.target.value),
                  disabled: !isEditing,
                  className: "profile__select",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "", children: "Select gender" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 581,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "male", children: "Male" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 582,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "female", children: "Female" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 583,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "other", children: "Other" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 584,
                      columnNumber: 41
                    }, globalThis)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 573,
                  columnNumber: 37
                },
                globalThis
              )
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 569,
              columnNumber: 33
            }, globalThis) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 568,
              columnNumber: 29
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__row", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-group", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-header", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { children: "Activity Level" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 592,
                  columnNumber: 41
                }, globalThis) }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 591,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "select",
                  {
                    id: "activity-level",
                    name: "activity-level",
                    value: profileData.activity_level,
                    onChange: (e) => handleInputChange("activity_level", e.target.value),
                    disabled: !isEditing,
                    className: "profile__select",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "sedentary", children: "Sedentary" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                        lineNumber: 602,
                        columnNumber: 41
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "light", children: "Light" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                        lineNumber: 603,
                        columnNumber: 41
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "moderate", children: "Moderate" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                        lineNumber: 604,
                        columnNumber: 41
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "active", children: "Active" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                        lineNumber: 605,
                        columnNumber: 41
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "very_active", children: "Very Active" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                        lineNumber: 606,
                        columnNumber: 41
                      }, globalThis)
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 594,
                    columnNumber: 37
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 590,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-group", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-header", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { children: "Orientation" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 612,
                  columnNumber: 41
                }, globalThis) }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 611,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "select",
                  {
                    id: "orientation",
                    name: "orientation",
                    value: profileData.orientation,
                    onChange: (e) => handleInputChange("orientation", e.target.value),
                    disabled: !isEditing,
                    className: "profile__select",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "", children: "Select orientation" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                        lineNumber: 622,
                        columnNumber: 41
                      }, globalThis),
                      orientationOptions.map((option) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: option.value, children: option.label }, option.value, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                        lineNumber: 624,
                        columnNumber: 45
                      }, globalThis))
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 614,
                    columnNumber: 37
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 610,
                columnNumber: 33
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 589,
              columnNumber: 29
            }, globalThis)
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
            lineNumber: 375,
            columnNumber: 25
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__actions", children: isEditing ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                className: `profile__save-btn ${isLoading ? "profile__save-btn--loading" : ""}`,
                onClick: handleSave,
                disabled: isLoading,
                children: isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__loading-spinner" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 643,
                    columnNumber: 49
                  }, globalThis),
                  "Updating..."
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 642,
                  columnNumber: 45
                }, globalThis) : hasProfile ? "Update Profile" : "Save Profile"
              },
              void 0,
              false,
              {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 636,
                columnNumber: 37
              },
              globalThis
            ),
            hasProfile && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                className: "profile__cancel-btn",
                onClick: handleCancel,
                disabled: isLoading,
                children: "Cancel"
              },
              void 0,
              false,
              {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 651,
                columnNumber: 41
              },
              globalThis
            )
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
            lineNumber: 635,
            columnNumber: 33
          }, globalThis) : hasProfile && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "button",
            {
              className: "profile__edit-btn",
              onClick: () => setIsEditing(true),
              children: "Edit Profile"
            },
            void 0,
            false,
            {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 662,
              columnNumber: 37
            },
            globalThis
          ) }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
            lineNumber: 633,
            columnNumber: 25
          }, globalThis)
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
          lineNumber: 362,
          columnNumber: 21
        }, globalThis) }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
          lineNumber: 361,
          columnNumber: 17
        }, globalThis)
      ] }, void 0, true, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
        lineNumber: 339,
        columnNumber: 13
      }, globalThis) }, void 0, false, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
        lineNumber: 338,
        columnNumber: 9
      }, globalThis);
    };
    const getProgressPercentage = (current, goal) => {
      return Math.min(current / goal * 100, 100);
    };
    const calculateMacroRatio = (macro, totalCalories) => {
      const macroCalories = macro * (macro === totalCalories ? 1 : 4);
      return totalCalories > 0 ? Math.round(macroCalories / totalCalories * 100) : 0;
    };
    const calculateAverageCaloriesPerMeal = (totalCalories, mealCount) => {
      return mealCount > 0 ? Math.round(totalCalories / mealCount) : 0;
    };
    const NUTRITION_CONSTANTS = {
      caloriesPerGramProtein: 4,
      caloriesPerGramCarbs: 4,
      caloriesPerGramFat: 9,
      caloriesPerGramAlcohol: 7,
      defaultMacroDistribution: {
        protein: 0.25,
        carbs: 0.45,
        fat: 0.3
      },
      mealTypeIcons: {
        breakfast: "🌅",
        lunch: "☀️",
        dinner: "🌙",
        snack: "🍿"
      },
      nutritionIcons: {
        calories: "🔥",
        protein: "💪",
        carbs: "🌾",
        fat: "🥑"
      }
    };
    const Journal$1 = "";
    const Journal = () => {
      const pageRef = reactExports.useRef(null);
      const { setCurrentSection } = useContentManager();
      const { todaysMeals, calorieData } = useCalorieTracker();
      const nutritionGoals = {
        goalCalories: calorieData.targetCalories,
        goalProtein: Math.round(calorieData.targetCalories * 0.3 / 4),
        // 30% of calories from protein
        goalCarbs: Math.round(calorieData.targetCalories * 0.45 / 4),
        // 45% of calories from carbs
        goalFat: Math.round(calorieData.targetCalories * 0.25 / 9)
        // 25% of calories from fat
      };
      const nutritionSummary = __spreadValues({
        totalCalories: calorieData.currentCalories,
        totalProtein: todaysMeals.reduce((sum, meal) => sum + meal.protein, 0),
        totalCarbs: todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0),
        totalFat: todaysMeals.reduce((sum, meal) => sum + meal.fat, 0)
      }, nutritionGoals);
      reactExports.useEffect(() => {
        setCurrentSection("journal");
      }, [setCurrentSection]);
      const getMealsByType = (type) => {
        return todaysMeals.filter((meal) => meal.mealType === type);
      };
      const getTotalMealsByType = (type) => {
        const typeMeals = getMealsByType(type);
        return typeMeals.reduce((sum, meal) => sum + meal.calories, 0);
      };
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { ref: pageRef, id: "journal", className: "journal", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__container", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__header", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "journal__title", children: "📝 Today's Health Journal" }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
            lineNumber: 63,
            columnNumber: 21
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__date", children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          }) }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
            lineNumber: 64,
            columnNumber: 21
          }, globalThis)
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
          lineNumber: 62,
          columnNumber: 17
        }, globalThis),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-overview", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "journal__section-title", children: "Daily Nutrition Summary" }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
            lineNumber: 76,
            columnNumber: 21
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-grid", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-card journal__nutrition-card--calories", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-icon", children: NUTRITION_CONSTANTS.nutritionIcons.calories }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 79,
                columnNumber: 29
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-content", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-value", children: [
                  Math.round(nutritionSummary.totalCalories),
                  " / ",
                  nutritionSummary.goalCalories
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                  lineNumber: 81,
                  columnNumber: 33
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-label", children: "Calories" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                  lineNumber: 84,
                  columnNumber: 33
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__progress-bar", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "journal__progress-fill journal__progress-fill--calories",
                    style: { width: `${getProgressPercentage(nutritionSummary.totalCalories, nutritionSummary.goalCalories)}%` }
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                    lineNumber: 86,
                    columnNumber: 37
                  },
                  globalThis
                ) }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                  lineNumber: 85,
                  columnNumber: 33
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 80,
                columnNumber: 29
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
              lineNumber: 78,
              columnNumber: 25
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-card journal__nutrition-card--protein", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-icon", children: NUTRITION_CONSTANTS.nutritionIcons.protein }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 95,
                columnNumber: 29
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-content", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-value", children: [
                  Math.round(nutritionSummary.totalProtein),
                  "g / ",
                  nutritionSummary.goalProtein,
                  "g"
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                  lineNumber: 97,
                  columnNumber: 33
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-label", children: "Protein" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                  lineNumber: 100,
                  columnNumber: 33
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__progress-bar", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "journal__progress-fill journal__progress-fill--protein",
                    style: { width: `${getProgressPercentage(nutritionSummary.totalProtein, nutritionSummary.goalProtein)}%` }
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                    lineNumber: 102,
                    columnNumber: 37
                  },
                  globalThis
                ) }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                  lineNumber: 101,
                  columnNumber: 33
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 96,
                columnNumber: 29
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
              lineNumber: 94,
              columnNumber: 25
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-card journal__nutrition-card--carbs", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-icon", children: NUTRITION_CONSTANTS.nutritionIcons.carbs }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 111,
                columnNumber: 29
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-content", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-value", children: [
                  Math.round(nutritionSummary.totalCarbs),
                  "g / ",
                  nutritionSummary.goalCarbs,
                  "g"
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                  lineNumber: 113,
                  columnNumber: 33
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-label", children: "Carbs" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                  lineNumber: 116,
                  columnNumber: 33
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__progress-bar", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "journal__progress-fill journal__progress-fill--carbs",
                    style: { width: `${getProgressPercentage(nutritionSummary.totalCarbs, nutritionSummary.goalCarbs)}%` }
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                    lineNumber: 118,
                    columnNumber: 37
                  },
                  globalThis
                ) }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                  lineNumber: 117,
                  columnNumber: 33
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 112,
                columnNumber: 29
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
              lineNumber: 110,
              columnNumber: 25
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-card journal__nutrition-card--fat", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-icon", children: NUTRITION_CONSTANTS.nutritionIcons.fat }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 127,
                columnNumber: 29
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-content", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-value", children: [
                  Math.round(nutritionSummary.totalFat),
                  "g / ",
                  nutritionSummary.goalFat,
                  "g"
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                  lineNumber: 129,
                  columnNumber: 33
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__nutrition-label", children: "Fat" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                  lineNumber: 132,
                  columnNumber: 33
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__progress-bar", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "journal__progress-fill journal__progress-fill--fat",
                    style: { width: `${getProgressPercentage(nutritionSummary.totalFat, nutritionSummary.goalFat)}%` }
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                    lineNumber: 134,
                    columnNumber: 37
                  },
                  globalThis
                ) }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                  lineNumber: 133,
                  columnNumber: 33
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 128,
                columnNumber: 29
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
              lineNumber: 126,
              columnNumber: 25
            }, globalThis)
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
            lineNumber: 77,
            columnNumber: 21
          }, globalThis)
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
          lineNumber: 75,
          columnNumber: 17
        }, globalThis),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__meals-timeline", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "journal__section-title", children: "Today's Detailed Meal Log" }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
            lineNumber: 146,
            columnNumber: 21
          }, globalThis),
          ["breakfast", "lunch", "dinner", "snack"].map((mealType) => {
            const typeMeals = getMealsByType(mealType);
            const typeCalories = getTotalMealsByType(mealType);
            if (typeMeals.length === 0)
              return null;
            return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__meal-section", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__meal-header", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__meal-type", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "journal__meal-icon", children: NUTRITION_CONSTANTS.mealTypeIcons[mealType] }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                    lineNumber: 158,
                    columnNumber: 41
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "journal__meal-title", children: mealType.charAt(0).toUpperCase() + mealType.slice(1) }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                    lineNumber: 161,
                    columnNumber: 41
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                  lineNumber: 157,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__meal-summary", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "journal__meal-count", children: [
                    typeMeals.length,
                    " ",
                    typeMeals.length === 1 ? "item" : "items"
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                    lineNumber: 166,
                    columnNumber: 41
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "journal__meal-calories", children: [
                    Math.round(typeCalories),
                    " cal"
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                    lineNumber: 169,
                    columnNumber: 41
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                  lineNumber: 165,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 156,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__meal-items", children: typeMeals.map((meal) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__meal-item", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__meal-time", children: meal.time }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                  lineNumber: 178,
                  columnNumber: 45
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__meal-details", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__meal-name", children: meal.name }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                    lineNumber: 182,
                    columnNumber: 49
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__meal-nutrition", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "journal__nutrition-item", children: [
                      NUTRITION_CONSTANTS.nutritionIcons.calories,
                      " ",
                      meal.calories,
                      " cal"
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                      lineNumber: 184,
                      columnNumber: 53
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "journal__nutrition-item", children: [
                      NUTRITION_CONSTANTS.nutritionIcons.protein,
                      " ",
                      meal.protein,
                      "g protein"
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                      lineNumber: 187,
                      columnNumber: 53
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "journal__nutrition-item", children: [
                      NUTRITION_CONSTANTS.nutritionIcons.carbs,
                      " ",
                      meal.carbs,
                      "g carbs"
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                      lineNumber: 190,
                      columnNumber: 53
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "journal__nutrition-item", children: [
                      NUTRITION_CONSTANTS.nutritionIcons.fat,
                      " ",
                      meal.fat,
                      "g fat"
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                      lineNumber: 193,
                      columnNumber: 53
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                    lineNumber: 183,
                    columnNumber: 49
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                  lineNumber: 181,
                  columnNumber: 45
                }, globalThis)
              ] }, meal.id, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 177,
                columnNumber: 41
              }, globalThis)) }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 175,
                columnNumber: 33
              }, globalThis)
            ] }, mealType, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
              lineNumber: 155,
              columnNumber: 29
            }, globalThis);
          })
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
          lineNumber: 145,
          columnNumber: 17
        }, globalThis),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__quick-stats", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "journal__section-title", children: "Today's Quick Stats" }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
            lineNumber: 208,
            columnNumber: 21
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__stats-grid", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__stat-card", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__stat-value", children: todaysMeals.length }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 211,
                columnNumber: 29
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__stat-label", children: "Total Meals/Snacks" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 212,
                columnNumber: 29
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
              lineNumber: 210,
              columnNumber: 25
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__stat-card", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__stat-value", children: [
                Math.round(nutritionSummary.totalCalories / nutritionSummary.goalCalories * 100),
                "%"
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 215,
                columnNumber: 29
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__stat-label", children: "Daily Goal Progress" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 218,
                columnNumber: 29
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
              lineNumber: 214,
              columnNumber: 25
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__stat-card", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__stat-value", children: calculateAverageCaloriesPerMeal(nutritionSummary.totalCalories, todaysMeals.length) }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 221,
                columnNumber: 29
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__stat-label", children: "Avg Calories per Meal" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 224,
                columnNumber: 29
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
              lineNumber: 220,
              columnNumber: 25
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__stat-card", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__stat-value", children: [
                calculateMacroRatio(nutritionSummary.totalProtein, nutritionSummary.totalCalories),
                "%"
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 227,
                columnNumber: 29
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "journal__stat-label", children: "Protein Ratio" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
                lineNumber: 230,
                columnNumber: 29
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
              lineNumber: 226,
              columnNumber: 25
            }, globalThis)
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
            lineNumber: 209,
            columnNumber: 21
          }, globalThis)
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
          lineNumber: 207,
          columnNumber: 17
        }, globalThis)
      ] }, void 0, true, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
        lineNumber: 61,
        columnNumber: 13
      }, globalThis) }, void 0, false, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Journal.tsx",
        lineNumber: 60,
        columnNumber: 9
      }, globalThis);
    };
    const AuthCallback = () => {
      const [status, setStatus] = reactExports.useState("processing");
      const [message, setMessage] = reactExports.useState("Completing sign in...");
      const navigate = useNavigate();
      reactExports.useEffect(() => {
        const handleCallback = () => __async(exports, null, function* () {
          try {
            console.log("Auth callback page loaded");
            setStatus("processing");
            setMessage("Completing sign in...");
            const result = yield SupabaseService$1.handleOAuthCallback();
            if (result.success) {
              console.log("OAuth callback successful");
              setStatus("success");
              setMessage("Sign in successful! Redirecting...");
              if (!window.opener || window.opener === window) {
                setTimeout(() => {
                  navigate("/", { replace: true });
                }, 1500);
              }
            } else {
              console.error("OAuth callback failed:", result.error);
              setStatus("error");
              setMessage(result.error || "Authentication failed. Please try again.");
              if (!window.opener || window.opener === window) {
                setTimeout(() => {
                  navigate("/", { replace: true });
                }, 3e3);
              }
            }
          } catch (error) {
            console.error("Auth callback error:", error);
            setStatus("error");
            setMessage("Authentication callback failed. Please try again.");
            if (window.opener && window.opener !== window) {
              window.opener.postMessage({
                type: "SUPABASE_AUTH_ERROR",
                error: { message: "Authentication callback failed" }
              }, window.location.origin);
              window.close();
            } else {
              setTimeout(() => {
                navigate("/", { replace: true });
              }, 3e3);
            }
          }
        });
        handleCallback();
      }, [navigate]);
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5"
      }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { style: {
        textAlign: "center",
        padding: "2rem",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }, children: [
        status === "processing" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { style: {
          width: "40px",
          height: "40px",
          border: "3px solid #e3e3e3",
          borderTop: "3px solid #007bff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 1rem"
        } }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AuthCallback.tsx",
          lineNumber: 86,
          columnNumber: 21
        }, globalThis),
        status === "success" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { style: {
          fontSize: "2rem",
          color: "#28a745",
          margin: "0 auto 1rem"
        }, children: "✓" }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AuthCallback.tsx",
          lineNumber: 97,
          columnNumber: 21
        }, globalThis),
        status === "error" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { style: {
          fontSize: "2rem",
          color: "#dc3545",
          margin: "0 auto 1rem"
        }, children: "✗" }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AuthCallback.tsx",
          lineNumber: 104,
          columnNumber: 21
        }, globalThis),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { style: {
          margin: 0,
          color: status === "error" ? "#dc3545" : status === "success" ? "#28a745" : "#666"
        }, children: message }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AuthCallback.tsx",
          lineNumber: 110,
          columnNumber: 17
        }, globalThis),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("style", { children: `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                ` }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AuthCallback.tsx",
          lineNumber: 116,
          columnNumber: 17
        }, globalThis)
      ] }, void 0, true, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AuthCallback.tsx",
        lineNumber: 78,
        columnNumber: 13
      }, globalThis) }, void 0, false, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AuthCallback.tsx",
        lineNumber: 70,
        columnNumber: 9
      }, globalThis);
    };
    const LoadingSpinner = ({ size = "md", message = "Loading..." }) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: `loading-spinner loading-spinner--${size}`, children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "loading-spinner__circle" }, void 0, false, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/LoadingSpinner.tsx",
        lineNumber: 8,
        columnNumber: 9
      }, globalThis),
      message && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "loading-spinner__message", children: message }, void 0, false, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/LoadingSpinner.tsx",
        lineNumber: 9,
        columnNumber: 21
      }, globalThis)
    ] }, void 0, true, {
      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/ui/LoadingSpinner.tsx",
      lineNumber: 7,
      columnNumber: 5
    }, globalThis);
    const ProtectedRoute$1 = "";
    const ProtectedRoute = ({ children, requireAdmin = false, fallback = null }) => {
      const { loading, isAuthenticated, isAdmin, user, signInWithGoogle, authLoading } = useAuth();
      const handleSignIn = reactExports.useCallback(() => __async(exports, null, function* () {
        if (authLoading)
          return;
        try {
          const result = yield signInWithGoogle();
          if (!result.success) {
            console.error("Sign in failed:", result.error);
          }
        } catch (error) {
          console.error("Sign in error:", error);
        }
      }), [signInWithGoogle, authLoading]);
      if (loading) {
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "protected-route protected-route--loading", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoadingSpinner, {}, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
          lineNumber: 32,
          columnNumber: 17
        }, globalThis) }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
          lineNumber: 31,
          columnNumber: 13
        }, globalThis);
      }
      if (!isAuthenticated) {
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "protected-route protected-route--unauthorized", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "protected-route__container", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "protected-route__title", children: "Sign In Required" }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
            lineNumber: 41,
            columnNumber: 21
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "protected-route__message", children: "Please sign in to access this page." }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
            lineNumber: 42,
            columnNumber: 21
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "button",
            {
              className: "protected-route__signin-btn",
              onClick: handleSignIn,
              disabled: authLoading,
              type: "button",
              children: authLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "protected-route__signin-icon", children: "⏳" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
                  lineNumber: 53,
                  columnNumber: 33
                }, globalThis),
                "Signing in..."
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
                lineNumber: 52,
                columnNumber: 29
              }, globalThis) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "protected-route__signin-icon", children: "🔐" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
                  lineNumber: 58,
                  columnNumber: 33
                }, globalThis),
                "Sign In with Google"
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
                lineNumber: 57,
                columnNumber: 29
              }, globalThis)
            },
            void 0,
            false,
            {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
              lineNumber: 45,
              columnNumber: 21
            },
            globalThis
          )
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
          lineNumber: 40,
          columnNumber: 17
        }, globalThis) }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
          lineNumber: 39,
          columnNumber: 13
        }, globalThis);
      }
      if (requireAdmin && !isAdmin) {
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "protected-route protected-route--unauthorized", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "protected-route__container", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "protected-route__title", children: "Access Denied" }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
            lineNumber: 72,
            columnNumber: 21
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "protected-route__message", children: "You don't have admin privileges to access this area." }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
            lineNumber: 73,
            columnNumber: 21
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "protected-route__user-info", children: [
            "Signed in as: ",
            user == null ? void 0 : user.email
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
            lineNumber: 76,
            columnNumber: 21
          }, globalThis)
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
          lineNumber: 71,
          columnNumber: 17
        }, globalThis) }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
          lineNumber: 70,
          columnNumber: 13
        }, globalThis);
      }
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children }, void 0, false, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
        lineNumber: 84,
        columnNumber: 12
      }, globalThis);
    };
    const useNavigation = (options = {}) => {
      const { autoInit = true, onStateChange } = options;
      const managerRef = reactExports.useRef(null);
      const unsubscribeRef = reactExports.useRef(null);
      const onStateChangeRef = reactExports.useRef(onStateChange);
      onStateChangeRef.current = onStateChange;
      const [state, setState] = reactExports.useState(() => {
        const manager = NavigationManager.getInstance();
        return manager.getState();
      });
      const [config2, setConfig] = reactExports.useState(() => ({
        items: [],
        animationDuration: 300,
        radius: 120,
        centerSize: 60,
        itemSize: 50,
        autoClose: true,
        closeDelay: 1e3,
        enableKeyboard: true,
        enableTouch: true,
        centerIcon: "menu",
        centerLabel: "Menu"
      }));
      reactExports.useEffect(() => {
        if (!autoInit)
          return;
        managerRef.current = NavigationManager.getInstance();
        setConfig(managerRef.current.getConfig());
        setState(managerRef.current.getState());
        unsubscribeRef.current = managerRef.current.subscribe((newState) => {
          var _a;
          setState(newState);
          (_a = onStateChangeRef.current) == null ? void 0 : _a.call(onStateChangeRef, newState);
        });
        const handleConfigUpdate = () => {
          if (managerRef.current) {
            setConfig(managerRef.current.getConfig());
          }
        };
        document.addEventListener("navigation:config-updated", handleConfigUpdate);
        return () => {
          var _a;
          (_a = unsubscribeRef.current) == null ? void 0 : _a.call(unsubscribeRef);
          unsubscribeRef.current = null;
          document.removeEventListener("navigation:config-updated", handleConfigUpdate);
        };
      }, [autoInit]);
      const actions = reactExports.useMemo(() => ({
        open: () => {
          var _a;
          return (_a = managerRef.current) == null ? void 0 : _a.open();
        },
        close: () => {
          var _a;
          return (_a = managerRef.current) == null ? void 0 : _a.close();
        },
        toggle: () => {
          var _a;
          return (_a = managerRef.current) == null ? void 0 : _a.toggle();
        },
        navigate: (itemId) => {
          var _a;
          return (_a = managerRef.current) == null ? void 0 : _a.navigate(itemId);
        },
        setHovered: (itemId) => {
          var _a;
          return (_a = managerRef.current) == null ? void 0 : _a.setHoveredItem(itemId);
        },
        updateAuthState: (isAuthenticated) => {
          var _a;
          return (_a = managerRef.current) == null ? void 0 : _a.updateAuthState(isAuthenticated);
        }
      }), []);
      return { state, actions, config: config2 };
    };
    const useNavigationEvents = (eventType, callback, deps = []) => {
      const callbackRef = reactExports.useRef(callback);
      callbackRef.current = callback;
      reactExports.useEffect(() => {
        const handleEvent = (e) => {
          var _a, _b;
          const customEvent = e;
          const event = {
            type: customEvent.type.replace("navigation:", ""),
            item: (_a = customEvent.detail) == null ? void 0 : _a.item,
            state: ((_b = customEvent.detail) == null ? void 0 : _b.state) || NavigationManager.getInstance().getState(),
            timestamp: Date.now()
          };
          if (eventType === "all" || event.type === eventType) {
            callbackRef.current(event);
          }
        };
        const events = eventType === "all" ? ["navigation:open", "navigation:close", "navigation:navigate", "navigation:navigate-blocked", "navigation:hover", "navigation:focus", "navigation:config-updated"] : [`navigation:${eventType}`];
        events.forEach((eventName) => {
          document.addEventListener(eventName, handleEvent);
        });
        return () => {
          events.forEach((eventName) => {
            document.removeEventListener(eventName, handleEvent);
          });
        };
      }, [eventType, ...deps]);
    };
    const useAuthNavigation = (isAuthenticated, authLoading = false) => {
      const navigation = useNavigation();
      reactExports.useEffect(() => {
        if (!authLoading && navigation.actions.updateAuthState) {
          navigation.actions.updateAuthState(isAuthenticated);
        }
      }, [isAuthenticated, authLoading, navigation.actions]);
      return navigation;
    };
    const _ScrollManager = class _ScrollManager {
      constructor() {
        __publicField(this, "observer", null);
        __publicField(this, "elements", /* @__PURE__ */ new Map());
        __publicField(this, "scrollPosition", 0);
        __publicField(this, "isScrolling", false);
        __publicField(this, "scrollTimeout", null);
        __publicField(this, "callbacks", /* @__PURE__ */ new Set());
        __publicField(this, "defaultConfig", {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
          triggerOnce: false,
          reverse: true
        });
        this.init();
      }
      static getInstance() {
        if (!_ScrollManager.instance) {
          _ScrollManager.instance = new _ScrollManager();
        }
        return _ScrollManager.instance;
      }
      init() {
        this.setupIntersectionObserver();
        this.setupScrollListener();
        this.bindMethods();
      }
      bindMethods() {
        this.handleIntersection = this.handleIntersection.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
      }
      setupIntersectionObserver() {
        const config2 = {
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
          rootMargin: this.defaultConfig.rootMargin
        };
        this.observer = new IntersectionObserver(this.handleIntersection, config2);
      }
      setupScrollListener() {
        let ticking = false;
        const scrollHandler = () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              this.handleScroll();
              ticking = false;
            });
            ticking = true;
          }
        };
        window.addEventListener("scroll", scrollHandler, { passive: true });
      }
      handleIntersection(entries) {
        entries.forEach((entry) => {
          const elementId = entry.target.getAttribute("data-scroll-id");
          if (!elementId)
            return;
          const animElement = this.elements.get(elementId);
          if (!animElement)
            return;
          const isVisible = entry.isIntersecting;
          const wasVisible = animElement.isVisible;
          animElement.isVisible = isVisible;
          if (isVisible && !wasVisible) {
            this.triggerAnimation(elementId, "enter");
          } else if (!isVisible && wasVisible && animElement.config.reverse) {
            this.triggerAnimation(elementId, "exit");
          }
        });
      }
      handleScroll() {
        const currentPosition = window.pageYOffset || document.documentElement.scrollTop;
        const direction = currentPosition > this.scrollPosition ? "down" : "up";
        this.scrollPosition = currentPosition;
        this.isScrolling = true;
        if (this.scrollTimeout) {
          clearTimeout(this.scrollTimeout);
        }
        this.scrollTimeout = window.setTimeout(() => {
          this.isScrolling = false;
        }, 150);
        this.callbacks.forEach((callback) => {
          callback(currentPosition, direction);
        });
      }
      register(element, animation, config2 = {}) {
        const id = `scroll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const finalConfig = __spreadValues(__spreadValues({}, this.defaultConfig), config2);
        element.setAttribute("data-scroll-id", id);
        this.elements.set(id, {
          element,
          animation,
          config: finalConfig,
          isVisible: false,
          hasAnimated: false
        });
        if (this.observer) {
          this.observer.observe(element);
        }
        return id;
      }
      unregister(id) {
        const animElement = this.elements.get(id);
        if (animElement && this.observer) {
          this.observer.unobserve(animElement.element);
          animElement.element.removeAttribute("data-scroll-id");
        }
        this.elements.delete(id);
      }
      triggerAnimation(id, type) {
        const animElement = this.elements.get(id);
        if (!animElement)
          return;
        const { element, animation, config: config2 } = animElement;
        if (config2.triggerOnce && animElement.hasAnimated && type === "enter") {
          return;
        }
        const animationClass = type === "enter" ? `${animation}-enter` : `${animation}-exit`;
        element.classList.remove(`${animation}-enter`, `${animation}-exit`);
        void element.offsetHeight;
        element.classList.add(animationClass);
        if (type === "enter") {
          animElement.hasAnimated = true;
        }
        const event = new CustomEvent("scrollAnimation", {
          detail: { id, type, animation, element }
        });
        element.dispatchEvent(event);
      }
      onScroll(callback) {
        this.callbacks.add(callback);
        return () => {
          this.callbacks.delete(callback);
        };
      }
      getScrollPosition() {
        return this.scrollPosition;
      }
      isCurrentlyScrolling() {
        return this.isScrolling;
      }
      scrollTo(target, smooth = true) {
        const options = {
          behavior: smooth ? "smooth" : "auto"
        };
        if (typeof target === "number") {
          options.top = target;
        } else {
          const rect = target.getBoundingClientRect();
          options.top = window.pageYOffset + rect.top;
        }
        window.scrollTo(options);
      }
      destroy() {
        if (this.observer) {
          this.observer.disconnect();
          this.observer = null;
        }
        if (this.scrollTimeout) {
          clearTimeout(this.scrollTimeout);
        }
        this.elements.clear();
        this.callbacks.clear();
      }
    };
    __publicField(_ScrollManager, "instance");
    let ScrollManager = _ScrollManager;
    const _PerformanceManager = class _PerformanceManager {
      constructor() {
        __publicField(this, "metrics", {
          fcp: null,
          lcp: null,
          fid: null,
          cls: null,
          ttfb: null
        });
        __publicField(this, "observers", /* @__PURE__ */ new Map());
        this.init();
      }
      static getInstance() {
        if (!_PerformanceManager.instance) {
          _PerformanceManager.instance = new _PerformanceManager();
        }
        return _PerformanceManager.instance;
      }
      init() {
        if (typeof window === "undefined")
          return;
        this.observeWebVitals();
        this.observeResourceTiming();
        this.setupErrorTracking();
      }
      observeWebVitals() {
        if ("PerformanceObserver" in window) {
          const paintObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.name === "first-contentful-paint") {
                this.metrics.fcp = entry.startTime;
                this.reportMetric("fcp", entry.startTime);
              }
            }
          });
          paintObserver.observe({ entryTypes: ["paint"] });
          this.observers.set("paint", paintObserver);
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
            this.reportMetric("lcp", lastEntry.startTime);
          });
          lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
          this.observers.set("lcp", lcpObserver);
          const fidObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const eventEntry = entry;
              if (eventEntry.processingStart !== void 0) {
                this.metrics.fid = eventEntry.processingStart - eventEntry.startTime;
                this.reportMetric("fid", this.metrics.fid);
              }
            }
          });
          try {
            fidObserver.observe({ entryTypes: ["first-input"] });
            this.observers.set("fid", fidObserver);
          } catch (error) {
            console.warn("First Input Delay observation not supported:", error);
          }
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const layoutShiftEntry = entry;
              if (!layoutShiftEntry.hadRecentInput) {
                clsValue += layoutShiftEntry.value;
              }
            }
            this.metrics.cls = clsValue;
            this.reportMetric("cls", clsValue);
          });
          try {
            clsObserver.observe({ entryTypes: ["layout-shift"] });
            this.observers.set("cls", clsObserver);
          } catch (error) {
            console.warn("Cumulative Layout Shift observation not supported:", error);
          }
        }
      }
      observeResourceTiming() {
        if ("PerformanceObserver" in window) {
          const resourceObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              this.analyzeResourceTiming(entry);
            }
          });
          resourceObserver.observe({ entryTypes: ["resource"] });
          this.observers.set("resource", resourceObserver);
        }
      }
      analyzeResourceTiming(entry) {
        const duration = entry.responseEnd - entry.startTime;
        if (duration > 1e3) {
          console.warn(`Slow resource detected: ${entry.name} took ${duration}ms`);
        }
        if (entry.initiatorType === "navigation") {
          this.metrics.ttfb = entry.responseStart - entry.startTime;
          this.reportMetric("ttfb", this.metrics.ttfb);
        }
      }
      setupErrorTracking() {
        window.addEventListener("error", (event) => {
          var _a;
          this.reportError({
            type: "javascript",
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: (_a = event.error) == null ? void 0 : _a.stack
          });
        });
        window.addEventListener("unhandledrejection", (event) => {
          var _a, _b;
          this.reportError({
            type: "promise",
            message: ((_a = event.reason) == null ? void 0 : _a.message) || "Unhandled Promise Rejection",
            stack: (_b = event.reason) == null ? void 0 : _b.stack
          });
        });
      }
      reportMetric(name, value) {
        {
          console.log(`Performance Metric - ${name.toUpperCase()}: ${value}ms`);
        }
        this.sendToAnalytics("performance_metric", {
          metric_name: name,
          metric_value: value,
          url: window.location.href,
          timestamp: Date.now()
        });
      }
      reportError(error) {
        console.error("Application Error:", error);
        this.sendToAnalytics("error", __spreadProps(__spreadValues({}, error), {
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        }));
      }
      sendToAnalytics(eventName, data) {
        {
          console.log(`Analytics Event: ${eventName}`, data);
        }
      }
      getMetrics() {
        return __spreadValues({}, this.metrics);
      }
      startMark(name) {
        if ("performance" in window && performance.mark) {
          performance.mark(`${name}-start`);
        }
      }
      endMark(name) {
        if ("performance" in window && performance.mark && performance.measure) {
          performance.mark(`${name}-end`);
          performance.measure(name, `${name}-start`, `${name}-end`);
          const entries = performance.getEntriesByName(name, "measure");
          return entries.length > 0 ? entries[0].duration : null;
        }
        return null;
      }
      destroy() {
        this.observers.forEach((observer) => observer.disconnect());
        this.observers.clear();
      }
    };
    __publicField(_PerformanceManager, "instance");
    let PerformanceManager = _PerformanceManager;
    const getEnvVar = (key, defaultValue) => {
      const value = { "VITE_SUPABASE_URL": "https://syxygcrxrldnhlcnpbyr.supabase.co", "VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5eHlnY3J4cmxkbmhsY25wYnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1ODU3NDMsImV4cCI6MjA3MTE2MTc0M30.21zINCjjS_O5bSdR5EMRhmUHum6yStGwCe_haGUgYeo", "VITE_APP_NAME": "Health Tracker", "VITE_APP_VERSION": "1.0.0-dev", "VITE_APP_DOMAIN": "localhost:3000", "VITE_APP_URL": "http://localhost:3000", "VITE_DEBUG_MODE": "true", "VITE_ENABLE_DEBUG_PANEL": "true", "VITE_ENABLE_LOGGING": "true", "VITE_ENABLE_PERFORMANCE_MONITORING": "true", "VITE_ENABLE_EXPERIMENTAL_FEATURES": "true", "VITE_API_BASE_URL": "http://localhost:3001/api", "VITE_API_TIMEOUT": "10000", "VITE_OAUTH_REDIRECT_URL": "http://localhost:3000/auth/callback", "BASE_URL": "/", "MODE": "development", "DEV": true, "PROD": false, "SSR": false }[key];
      if (value === void 0 && defaultValue === void 0) {
        console.warn(`Environment variable ${key} is not defined`);
        return "";
      }
      return value || defaultValue || "";
    };
    const getBooleanEnvVar = (key, defaultValue = false) => {
      const value = { "VITE_SUPABASE_URL": "https://syxygcrxrldnhlcnpbyr.supabase.co", "VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5eHlnY3J4cmxkbmhsY25wYnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1ODU3NDMsImV4cCI6MjA3MTE2MTc0M30.21zINCjjS_O5bSdR5EMRhmUHum6yStGwCe_haGUgYeo", "VITE_APP_NAME": "Health Tracker", "VITE_APP_VERSION": "1.0.0-dev", "VITE_APP_DOMAIN": "localhost:3000", "VITE_APP_URL": "http://localhost:3000", "VITE_DEBUG_MODE": "true", "VITE_ENABLE_DEBUG_PANEL": "true", "VITE_ENABLE_LOGGING": "true", "VITE_ENABLE_PERFORMANCE_MONITORING": "true", "VITE_ENABLE_EXPERIMENTAL_FEATURES": "true", "VITE_API_BASE_URL": "http://localhost:3001/api", "VITE_API_TIMEOUT": "10000", "VITE_OAUTH_REDIRECT_URL": "http://localhost:3000/auth/callback", "BASE_URL": "/", "MODE": "development", "DEV": true, "PROD": false, "SSR": false }[key];
      if (value === void 0)
        return defaultValue;
      return value === "true" || value === "1" || value === "yes";
    };
    const getNumericEnvVar = (key, defaultValue = 0) => {
      const value = { "VITE_SUPABASE_URL": "https://syxygcrxrldnhlcnpbyr.supabase.co", "VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5eHlnY3J4cmxkbmhsY25wYnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1ODU3NDMsImV4cCI6MjA3MTE2MTc0M30.21zINCjjS_O5bSdR5EMRhmUHum6yStGwCe_haGUgYeo", "VITE_APP_NAME": "Health Tracker", "VITE_APP_VERSION": "1.0.0-dev", "VITE_APP_DOMAIN": "localhost:3000", "VITE_APP_URL": "http://localhost:3000", "VITE_DEBUG_MODE": "true", "VITE_ENABLE_DEBUG_PANEL": "true", "VITE_ENABLE_LOGGING": "true", "VITE_ENABLE_PERFORMANCE_MONITORING": "true", "VITE_ENABLE_EXPERIMENTAL_FEATURES": "true", "VITE_API_BASE_URL": "http://localhost:3001/api", "VITE_API_TIMEOUT": "10000", "VITE_OAUTH_REDIRECT_URL": "http://localhost:3000/auth/callback", "BASE_URL": "/", "MODE": "development", "DEV": true, "PROD": false, "SSR": false }[key];
      if (value === void 0)
        return defaultValue;
      const num = parseInt(value, 10);
      return isNaN(num) ? defaultValue : num;
    };
    const getCurrentEnv = () => {
      const nodeEnv = {}.NODE_ENV;
      if (nodeEnv === "production")
        return "production";
      if (nodeEnv === "development")
        return "development";
      return "development";
    };
    const appConfig = (() => {
      const env = getCurrentEnv();
      const isDev = env === "development";
      const isProd = env === "production";
      return {
        // Environment - dynamic based on build mode
        env,
        isDevelopment: isDev,
        isProduction: isProd,
        // App Info
        name: getEnvVar("VITE_APP_NAME", "Health Tracker Prototype"),
        version: getEnvVar("VITE_APP_VERSION", isProd ? "1.0.0" : "1.0.0-dev"),
        description: getEnvVar("VITE_APP_DESCRIPTION", "Health and nutrition tracking prototype"),
        // API Configuration
        api: {
          baseUrl: getEnvVar("VITE_API_BASE_URL", isProd ? "/api" : "http://localhost:3001/api"),
          timeout: getNumericEnvVar("VITE_API_TIMEOUT", 1e4)
        },
        // Supabase Configuration
        supabase: {
          url: getEnvVar("VITE_SUPABASE_URL"),
          anonKey: getEnvVar("VITE_SUPABASE_ANON_KEY")
        },
        // Development Features - environment dependent
        debug: {
          enabled: getBooleanEnvVar("VITE_DEBUG_MODE", isDev),
          showPanel: getBooleanEnvVar("VITE_ENABLE_DEBUG_PANEL", isDev),
          enableLogging: getBooleanEnvVar("VITE_ENABLE_LOGGING", isDev),
          enablePerformanceMonitoring: getBooleanEnvVar("VITE_ENABLE_PERFORMANCE_MONITORING", isDev)
        },
        // Feature Flags - experimental features enabled in development only
        features: {
          experimentalFeatures: getBooleanEnvVar("VITE_ENABLE_EXPERIMENTAL_FEATURES", isDev)
        }
      };
    })();
    const validateConfig = () => {
      const requiredFields = [
        "VITE_SUPABASE_URL",
        "VITE_SUPABASE_ANON_KEY"
      ];
      const missingFields = requiredFields.filter((field) => !getEnvVar(field));
      if (missingFields.length > 0) {
        console.error("Missing required environment variables:", missingFields);
        throw new Error(`Missing required environment variables: ${missingFields.join(", ")}`);
      }
      console.log("✅ Configuration validated successfully");
      console.log("📊 App Config:", {
        name: appConfig.name,
        version: appConfig.version,
        env: appConfig.env,
        debug: appConfig.debug.enabled
      });
    };
    const devHelpers = {
      /**
       * Log configuration in development
       */
      logConfig: () => {
        if (appConfig.debug.enableLogging) {
          console.group("🔧 App Configuration");
          console.log("Environment:", appConfig.env);
          console.log("Version:", appConfig.version);
          console.log("Debug Mode:", appConfig.debug.enabled);
          console.log("Experimental Features:", appConfig.features.experimentalFeatures);
          console.groupEnd();
        }
      },
      /**
       * Check if a feature is enabled
       */
      isFeatureEnabled: (feature) => {
        return appConfig.features[feature];
      },
      /**
       * Development mode checks
       */
      isDev: () => appConfig.isDevelopment,
      debugEnabled: () => appConfig.debug.enabled,
      loggingEnabled: () => appConfig.debug.enableLogging
    };
    if (typeof window !== "undefined") {
      validateConfig();
      devHelpers.logConfig();
    }
    const App$1 = "";
    const Layout = ({ children }) => {
      const auth = useAuth();
      const navigation = useAuthNavigation(auth.isAuthenticated, auth.loading);
      const { actions: navActions } = navigation;
      const location = useLocation();
      const handleNavigate = (sectionId) => {
        navActions.navigate(sectionId);
      };
      const showFooter = location.pathname === "/";
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "app", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          ModernNavigation,
          {
            position: "fixed-top",
            onNavigate: handleNavigate,
            brand: "Health Tracker",
            brandHref: "/"
          },
          void 0,
          false,
          {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
            lineNumber: 36,
            columnNumber: 7
          },
          globalThis
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("main", { className: "app__main", children }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 44,
          columnNumber: 7
        }, globalThis),
        showFooter && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("footer", { className: "app__footer", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "app__footer-content", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "app__footer-main", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "app__footer-brand", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("strong", { children: appConfig.name }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 54,
              columnNumber: 17
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Your health journey starts here" }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 55,
              columnNumber: 17
            }, globalThis)
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
            lineNumber: 53,
            columnNumber: 15
          }, globalThis) }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
            lineNumber: 52,
            columnNumber: 13
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "app__footer-bottom", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
              "© 2025 ",
              appConfig.name
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 59,
              columnNumber: 15
            }, globalThis),
            appConfig.debug.enabled && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "app__footer-version", children: [
              "v",
              appConfig.version
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 61,
              columnNumber: 17
            }, globalThis)
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
            lineNumber: 58,
            columnNumber: 13
          }, globalThis)
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 51,
          columnNumber: 11
        }, globalThis) }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 50,
          columnNumber: 9
        }, globalThis)
      ] }, void 0, true, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
        lineNumber: 34,
        columnNumber: 5
      }, globalThis);
    };
    const HomePage = () => {
      const auth = useAuth();
      const navigation = useAuthNavigation(auth.isAuthenticated, auth.loading);
      const { isAuthenticated, authLoading } = auth;
      const { actions: navActions } = navigation;
      const handleNavigate = (sectionId) => {
        navActions.navigate(sectionId);
      };
      const handleSignIn = () => __async(exports, null, function* () {
        yield auth.signInWithGoogle();
      });
      const primaryCtaText = authLoading ? "Signing in..." : isAuthenticated ? "Go to Add Meals" : "Sign In with Google";
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { id: "home", className: "app__section", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        Hero,
        {
          title: `Welcome to ${appConfig.name}`,
          subtitle: "Track your health and nutrition journey with ease",
          primaryCtaText,
          onPrimaryCtaClick: () => {
            if (authLoading)
              return;
            return isAuthenticated ? handleNavigate("add-meals") : handleSignIn();
          }
        },
        void 0,
        false,
        {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 98,
          columnNumber: 7
        },
        globalThis
      ) }, void 0, false, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
        lineNumber: 97,
        columnNumber: 5
      }, globalThis);
    };
    function App() {
      const [isLoading, setIsLoading] = reactExports.useState(true);
      const auth = useAuth();
      const navigation = useAuthNavigation(auth.isAuthenticated, auth.loading);
      const { isAuthenticated, loading, authLoading } = auth;
      reactExports.useEffect(() => {
        const scrollManager = ScrollManager.getInstance();
        const performanceManager = PerformanceManager.getInstance();
        if (appConfig.debug.enablePerformanceMonitoring) {
          performanceManager.startMark("app-init");
        }
        if (appConfig.debug.enableLogging) {
          console.log("🚀 Health Tracker App initializing...");
          console.log("📱 Version:", appConfig.version);
          console.log("🔧 Environment:", appConfig.env);
          console.log("🧭 Navigation items configured: Home, Add Meals, Journal");
          console.log("🌐 Router-based navigation enabled");
        }
        return () => {
          scrollManager.destroy();
          performanceManager.destroy();
          if (appConfig.debug.enableLogging) {
            console.log("🧹 App cleanup completed");
          }
        };
      }, []);
      useNavigationEvents("all", (event) => {
        var _a;
        if (appConfig.debug.enableLogging) {
          console.log("🧭 Navigation event:", event);
        }
        if (event.type === "navigate-blocked") {
          console.log("🔒 Navigation blocked - authentication required for:", (_a = event.item) == null ? void 0 : _a.label);
        }
        if (devHelpers.isFeatureEnabled("experimentalFeatures")) {
          console.log("📊 Experimental tracking enabled for:", event);
        }
      }, []);
      reactExports.useEffect(() => {
        const handleGoogleSigninRequest = (event) => __async(this, null, function* () {
          var _a;
          const item = (_a = event.detail) == null ? void 0 : _a.item;
          if (appConfig.debug.enableLogging) {
            console.log("🔐 Google sign-in requested for:", item == null ? void 0 : item.label);
          }
          try {
            const result = yield auth.signInWithGoogle();
            if (result.success && item) {
              setTimeout(() => {
                navigation.actions.navigate(item.id);
              }, 1e3);
            }
          } catch (error) {
            console.error("🔐 Google sign-in failed:", error);
          }
        });
        document.addEventListener("navigation:google-signin-requested", handleGoogleSigninRequest);
        return () => {
          document.removeEventListener("navigation:google-signin-requested", handleGoogleSigninRequest);
        };
      }, [auth, navigation.actions]);
      const handlePreloaderComplete = () => {
        setIsLoading(false);
        document.body.classList.add("app-loaded");
        if (appConfig.debug.enableLogging) {
          console.log("✅ App loaded successfully");
          console.log("🔐 Authentication state:", isAuthenticated ? "authenticated" : "not authenticated");
          if (appConfig.debug.enablePerformanceMonitoring) {
            const performanceManager = PerformanceManager.getInstance();
            performanceManager.endMark("app-init");
            console.log("⏱️ App initialization complete");
          }
        }
      };
      if (isLoading && !authLoading) {
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Preloader,
          {
            onComplete: handlePreloaderComplete,
            duration: 1200,
            minDisplayTime: 800
          },
          void 0,
          false,
          {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
            lineNumber: 220,
            columnNumber: 7
          },
          this
        );
      }
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(BrowserRouter, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Layout, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Routes, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "/", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(HomePage, {}, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 233,
          columnNumber: 36
        }, this) }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 233,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "/auth/callback", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AuthCallback, {}, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 236,
          columnNumber: 49
        }, this) }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 236,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Route,
          {
            path: "/add-meals",
            element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AddMeals, {}, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 243,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 242,
              columnNumber: 15
            }, this)
          },
          void 0,
          false,
          {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
            lineNumber: 239,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Route,
          {
            path: "/profile",
            element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Profile, {}, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 253,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 252,
              columnNumber: 15
            }, this)
          },
          void 0,
          false,
          {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
            lineNumber: 249,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Route,
          {
            path: "/journal",
            element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Journal, {}, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 263,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 262,
              columnNumber: 15
            }, this)
          },
          void 0,
          false,
          {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
            lineNumber: 259,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "*", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Navigate, { to: "/", replace: true }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 269,
          columnNumber: 36
        }, this) }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 269,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
        lineNumber: 231,
        columnNumber: 9
      }, this) }, void 0, false, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
        lineNumber: 230,
        columnNumber: 7
      }, this) }, void 0, false, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
        lineNumber: 229,
        columnNumber: 5
      }, this);
    }
    createRoot(document.getElementById("root")).render(
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(reactExports.StrictMode, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(App, {}, void 0, false, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/main.tsx",
        lineNumber: 9,
        columnNumber: 5
      }, globalThis) }, void 0, false, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/main.tsx",
        lineNumber: 8,
        columnNumber: 3
      }, globalThis)
    );
  }
});
export default require_js();
//# sourceMappingURL=index.js.map
