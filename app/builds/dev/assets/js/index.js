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
      const [navState, setNavState] = reactExports.useState(() => ({
        isOpen: false,
        activeItem: "home",
        hoveredItem: null,
        focusedItem: null,
        keyboardMode: false
      }));
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
              lineNumber: 210,
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
      var _a, _b;
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
      const todaysMeals = reactExports.useMemo(() => [
        {
          id: "1",
          name: "Oatmeal with Berries",
          calories: 320,
          protein: 12,
          carbs: 58,
          fat: 6,
          mealType: "breakfast",
          time: "8:00 AM"
        },
        {
          id: "2",
          name: "Grilled Chicken Salad",
          calories: 450,
          protein: 35,
          carbs: 25,
          fat: 18,
          mealType: "lunch",
          time: "12:30 PM"
        },
        {
          id: "3",
          name: "Greek Yogurt",
          calories: 150,
          protein: 15,
          carbs: 12,
          fat: 5,
          mealType: "snack",
          time: "3:15 PM"
        }
      ], []);
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
        return __spreadProps(__spreadValues({}, totals), {
          goalCalories: 2e3,
          goalProtein: 150,
          goalCarbs: 250,
          goalFat: 65
        });
      }, [todaysMeals]);
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
                lineNumber: 295,
                columnNumber: 33
              }, globalThis) }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                lineNumber: 294,
                columnNumber: 29
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__auth-text", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "hero__title", children: title }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                  lineNumber: 299,
                  columnNumber: 33
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "hero__subtitle", children: subtitle }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                  lineNumber: 300,
                  columnNumber: 33
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "hero__description", children: description }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                  lineNumber: 301,
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
                        lineNumber: 310,
                        columnNumber: 41
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__cta-text", children: primaryCtaText }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 311,
                        columnNumber: 41
                      }, globalThis)
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 304,
                    columnNumber: 37
                  },
                  globalThis
                ) }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                  lineNumber: 303,
                  columnNumber: 33
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                lineNumber: 298,
                columnNumber: 29
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
              lineNumber: 293,
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
                lineNumber: 320,
                columnNumber: 33
              }, globalThis) }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                lineNumber: 319,
                columnNumber: 29
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__meals-visualization", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__macro-pie-chart", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("svg", { className: "hero__pie-svg", width: "200", height: "200", viewBox: "0 0 42 42", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "circle",
                      {
                        className: "hero__pie-bg",
                        cx: "21",
                        cy: "21",
                        r: "15.91549430918954",
                        fill: "transparent",
                        stroke: "#e2e8f0",
                        strokeWidth: "3"
                      },
                      void 0,
                      false,
                      {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 330,
                        columnNumber: 41
                      },
                      globalThis
                    ),
                    (() => {
                      const total = nutritionSummary.protein + nutritionSummary.carbs + nutritionSummary.fat;
                      if (total === 0)
                        return null;
                      const proteinPercentage = nutritionSummary.protein / total * 100;
                      const carbsPercentage = nutritionSummary.carbs / total * 100;
                      const fatPercentage = nutritionSummary.fat / total * 100;
                      let cumulativePercentage = 0;
                      const segments = [];
                      if (proteinPercentage > 0) {
                        segments.push(
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "circle",
                            {
                              className: "hero__pie-segment hero__pie-segment--protein",
                              cx: "21",
                              cy: "21",
                              r: "15.91549430918954",
                              fill: "transparent",
                              stroke: "#10b981",
                              strokeWidth: "3",
                              strokeDasharray: `${proteinPercentage} ${100 - proteinPercentage}`,
                              strokeDashoffset: 25 - cumulativePercentage,
                              transform: "rotate(-90 21 21)"
                            },
                            "protein",
                            false,
                            {
                              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                              lineNumber: 355,
                              columnNumber: 53
                            },
                            globalThis
                          )
                        );
                        cumulativePercentage += proteinPercentage;
                      }
                      if (carbsPercentage > 0) {
                        segments.push(
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "circle",
                            {
                              className: "hero__pie-segment hero__pie-segment--carbs",
                              cx: "21",
                              cy: "21",
                              r: "15.91549430918954",
                              fill: "transparent",
                              stroke: "#f59e0b",
                              strokeWidth: "3",
                              strokeDasharray: `${carbsPercentage} ${100 - carbsPercentage}`,
                              strokeDashoffset: 25 - cumulativePercentage,
                              transform: "rotate(-90 21 21)"
                            },
                            "carbs",
                            false,
                            {
                              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                              lineNumber: 375,
                              columnNumber: 53
                            },
                            globalThis
                          )
                        );
                        cumulativePercentage += carbsPercentage;
                      }
                      if (fatPercentage > 0) {
                        segments.push(
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "circle",
                            {
                              className: "hero__pie-segment hero__pie-segment--fat",
                              cx: "21",
                              cy: "21",
                              r: "15.91549430918954",
                              fill: "transparent",
                              stroke: "#ec4899",
                              strokeWidth: "3",
                              strokeDasharray: `${fatPercentage} ${100 - fatPercentage}`,
                              strokeDashoffset: 25 - cumulativePercentage,
                              transform: "rotate(-90 21 21)"
                            },
                            "fat",
                            false,
                            {
                              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                              lineNumber: 395,
                              columnNumber: 53
                            },
                            globalThis
                          )
                        );
                      }
                      return segments;
                    })(),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("text", { x: "21", y: "22", textAnchor: "middle", className: "hero__pie-calories", children: nutritionSummary.calories }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 415,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("text", { x: "21", y: "29", textAnchor: "middle", className: "hero__pie-calories-label", children: "calories" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 418,
                      columnNumber: 41
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 328,
                    columnNumber: 37
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__macro-legend", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__legend-item hero__legend-item--protein", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__legend-color" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 426,
                        columnNumber: 45
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__legend-label", children: "Protein" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 427,
                        columnNumber: 45
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__legend-value", children: [
                        nutritionSummary.protein,
                        "g"
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 428,
                        columnNumber: 45
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 425,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__legend-item hero__legend-item--carbs", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__legend-color" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 431,
                        columnNumber: 45
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__legend-label", children: "Carbs" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 432,
                        columnNumber: 45
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__legend-value", children: [
                        nutritionSummary.carbs,
                        "g"
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 433,
                        columnNumber: 45
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 430,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__legend-item hero__legend-item--fat", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__legend-color" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 436,
                        columnNumber: 45
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__legend-label", children: "Fat" }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 437,
                        columnNumber: 45
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__legend-value", children: [
                        nutritionSummary.fat,
                        "g"
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 438,
                        columnNumber: 45
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 435,
                      columnNumber: 41
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 424,
                    columnNumber: 37
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                  lineNumber: 327,
                  columnNumber: 33
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__meals-list", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "hero__meals-title", children: "Today's Meals" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 445,
                    columnNumber: 37
                  }, globalThis),
                  todaysMeals.length > 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__meals-grid", children: todaysMeals.map((meal, index2) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__meal-card", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__meal-header", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__meal-type", children: [
                        meal.mealType === "breakfast" && "🌅",
                        meal.mealType === "lunch" && "☀️",
                        meal.mealType === "dinner" && "🌙",
                        meal.mealType === "snack" && "🍿",
                        meal.mealType
                      ] }, void 0, true, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 451,
                        columnNumber: 57
                      }, globalThis),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "hero__meal-time", children: meal.time }, void 0, false, {
                        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                        lineNumber: 458,
                        columnNumber: 57
                      }, globalThis)
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 450,
                      columnNumber: 53
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__meal-name", children: meal.name }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 460,
                      columnNumber: 53
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__meal-calories", children: [
                      meal.calories,
                      " cal"
                    ] }, void 0, true, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 461,
                      columnNumber: 53
                    }, globalThis)
                  ] }, meal.id, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 449,
                    columnNumber: 49
                  }, globalThis)) }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 447,
                    columnNumber: 41
                  }, globalThis) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hero__no-meals", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { children: "No meals tracked today yet" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                      lineNumber: 467,
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
                        lineNumber: 468,
                        columnNumber: 45
                      },
                      globalThis
                    )
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                    lineNumber: 466,
                    columnNumber: 41
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                  lineNumber: 444,
                  columnNumber: 33
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
                lineNumber: 325,
                columnNumber: 29
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
              lineNumber: 318,
              columnNumber: 25
            }, globalThis)
          ) }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
            lineNumber: 290,
            columnNumber: 17
          }, globalThis) }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
            lineNumber: 289,
            columnNumber: 13
          }, globalThis)
        },
        void 0,
        false,
        {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/sections/Hero.tsx",
          lineNumber: 282,
          columnNumber: 9
        },
        globalThis
      );
    };
    const AddMeals$1 = "";
    const AddMeals = () => {
      const pageRef = reactExports.useRef(null);
      const { setCurrentSection } = useContentManager();
      useAuth();
      const [meals, setMeals] = reactExports.useState([]);
      reactExports.useState(false);
      const [searchQuery, setSearchQuery] = reactExports.useState("");
      const [selectedMealType, setSelectedMealType] = reactExports.useState("breakfast");
      const [showQuickAdd, setShowQuickAdd] = reactExports.useState(false);
      const [nutritionSummary, setNutritionSummary] = reactExports.useState({
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        goalCalories: 2e3,
        goalProtein: 150,
        goalCarbs: 250,
        goalFat: 65
      });
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
        const sampleMeals = [
          {
            id: "1",
            name: "Oatmeal with Banana",
            calories: 259,
            protein: 7.3,
            carbs: 55,
            fat: 3.4,
            timestamp: /* @__PURE__ */ new Date(),
            mealType: "breakfast"
          },
          {
            id: "2",
            name: "Grilled Chicken Salad",
            calories: 285,
            protein: 35,
            carbs: 12,
            fat: 8,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1e3),
            // 2 hours ago
            mealType: "lunch"
          }
        ];
        setMeals(sampleMeals);
        updateNutritionSummary(sampleMeals);
      }, [setCurrentSection]);
      const updateNutritionSummary = (mealList) => {
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        const todaysMeals = mealList.filter((meal) => {
          const mealDate = new Date(meal.timestamp);
          mealDate.setHours(0, 0, 0, 0);
          return mealDate.getTime() === today.getTime();
        });
        const summary = todaysMeals.reduce(
          (acc, meal) => __spreadProps(__spreadValues({}, acc), {
            totalCalories: acc.totalCalories + meal.calories,
            totalProtein: acc.totalProtein + meal.protein,
            totalCarbs: acc.totalCarbs + meal.carbs,
            totalFat: acc.totalFat + meal.fat
          }),
          {
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            goalCalories: nutritionSummary.goalCalories,
            goalProtein: nutritionSummary.goalProtein,
            goalCarbs: nutritionSummary.goalCarbs,
            goalFat: nutritionSummary.goalFat
          }
        );
        setNutritionSummary(summary);
      };
      const addMeal = (food) => {
        const newMeal = {
          id: Date.now().toString(),
          name: food.name,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          timestamp: /* @__PURE__ */ new Date(),
          mealType: selectedMealType
        };
        const updatedMeals = [...meals, newMeal];
        setMeals(updatedMeals);
        updateNutritionSummary(updatedMeals);
        setShowQuickAdd(false);
      };
      const removeMeal = (mealId) => {
        const updatedMeals = meals.filter((meal) => meal.id !== mealId);
        setMeals(updatedMeals);
        updateNutritionSummary(updatedMeals);
      };
      const filteredFoods = quickAddFoods.filter(
        (food) => food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const getMealsByType = (type) => {
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        return meals.filter((meal) => {
          const mealDate = new Date(meal.timestamp);
          mealDate.setHours(0, 0, 0, 0);
          return meal.mealType === type && mealDate.getTime() === today.getTime();
        });
      };
      const getProgressPercentage = (current, goal) => {
        return Math.min(current / goal * 100, 100);
      };
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { ref: pageRef, id: "add-meals", className: "add-meals", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__container", children: [
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
              lineNumber: 192,
              columnNumber: 21
            },
            globalThis
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { className: "add-meals__quick-btn", children: "🔍 Search Foods" }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 198,
            columnNumber: 21
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { className: "add-meals__quick-btn", children: "📊 Custom Entry" }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 201,
            columnNumber: 21
          }, globalThis)
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
          lineNumber: 191,
          columnNumber: 17
        }, globalThis),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__nutrition-summary", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "add-meals__section-title", children: "Today's Nutrition" }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 208,
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
                    lineNumber: 214,
                    columnNumber: 37
                  },
                  globalThis
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "path",
                  {
                    className: "add-meals__circle-progress add-meals__circle-progress--calories",
                    strokeDasharray: `${getProgressPercentage(nutritionSummary.totalCalories, nutritionSummary.goalCalories)}, 100`,
                    d: "M18 2.0845\r\n                                           a 15.9155 15.9155 0 0 1 0 31.831\r\n                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 219,
                    columnNumber: 37
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 213,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-content", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-icon", children: "🔥" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 227,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-value", children: Math.round(nutritionSummary.totalCalories) }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 228,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-label", children: "Calories" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 229,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 226,
                columnNumber: 33
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 212,
              columnNumber: 29
            }, globalThis) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 211,
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
                    lineNumber: 238,
                    columnNumber: 37
                  },
                  globalThis
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "path",
                  {
                    className: "add-meals__circle-progress add-meals__circle-progress--protein",
                    strokeDasharray: `${getProgressPercentage(nutritionSummary.totalProtein, nutritionSummary.goalProtein)}, 100`,
                    d: "M18 2.0845\r\n                                           a 15.9155 15.9155 0 0 1 0 31.831\r\n                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 243,
                    columnNumber: 37
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 237,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-content", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-icon", children: "💪" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 251,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-value", children: [
                  Math.round(nutritionSummary.totalProtein),
                  "g"
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 252,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-label", children: "Protein" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 253,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 250,
                columnNumber: 33
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 236,
              columnNumber: 29
            }, globalThis) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 235,
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
                    lineNumber: 262,
                    columnNumber: 37
                  },
                  globalThis
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "path",
                  {
                    className: "add-meals__circle-progress add-meals__circle-progress--carbs",
                    strokeDasharray: `${getProgressPercentage(nutritionSummary.totalCarbs, nutritionSummary.goalCarbs)}, 100`,
                    d: "M18 2.0845\r\n                                           a 15.9155 15.9155 0 0 1 0 31.831\r\n                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 267,
                    columnNumber: 37
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 261,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-content", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-icon", children: "🌾" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 275,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-value", children: [
                  Math.round(nutritionSummary.totalCarbs),
                  "g"
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 276,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-label", children: "Carbs" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 277,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 274,
                columnNumber: 33
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 260,
              columnNumber: 29
            }, globalThis) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 259,
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
                    lineNumber: 286,
                    columnNumber: 37
                  },
                  globalThis
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "path",
                  {
                    className: "add-meals__circle-progress add-meals__circle-progress--fat",
                    strokeDasharray: `${getProgressPercentage(nutritionSummary.totalFat, nutritionSummary.goalFat)}, 100`,
                    d: "M18 2.0845\r\n                                           a 15.9155 15.9155 0 0 1 0 31.831\r\n                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                  },
                  void 0,
                  false,
                  {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 291,
                    columnNumber: 37
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 285,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-content", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-icon", children: "🥑" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 299,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-value", children: [
                  Math.round(nutritionSummary.totalFat),
                  "g"
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 300,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__circle-label", children: "Fat" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 301,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 298,
                columnNumber: 33
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 284,
              columnNumber: 29
            }, globalThis) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 283,
              columnNumber: 25
            }, globalThis)
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 209,
            columnNumber: 21
          }, globalThis)
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
          lineNumber: 207,
          columnNumber: 17
        }, globalThis),
        showQuickAdd && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__quick-add-panel", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__panel-header", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "add-meals__panel-title", children: "Quick Add Foods" }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 312,
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
                lineNumber: 313,
                columnNumber: 29
              },
              globalThis
            )
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 311,
            columnNumber: 25
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__meal-type-selector", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "add-meals__meal-label", children: "Meal Type:" }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 322,
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
                    lineNumber: 328,
                    columnNumber: 33
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "lunch", children: "☀️ Lunch" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 329,
                    columnNumber: 33
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "dinner", children: "🌙 Dinner" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 330,
                    columnNumber: 33
                  }, globalThis),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "snack", children: "🍿 Snack" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 331,
                    columnNumber: 33
                  }, globalThis)
                ]
              },
              void 0,
              true,
              {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 323,
                columnNumber: 29
              },
              globalThis
            )
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 321,
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
              lineNumber: 336,
              columnNumber: 29
            },
            globalThis
          ) }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 335,
            columnNumber: 25
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__foods-grid", children: filteredFoods.map((food, index2) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__food-card", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__food-info", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h4", { className: "add-meals__food-name", children: food.name }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 349,
                columnNumber: 41
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__food-nutrition", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                  food.calories,
                  " cal"
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 351,
                  columnNumber: 45
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                  food.protein,
                  "g protein"
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 352,
                  columnNumber: 45
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 350,
                columnNumber: 41
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 348,
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
                lineNumber: 355,
                columnNumber: 37
              },
              globalThis
            )
          ] }, index2, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 347,
            columnNumber: 33
          }, globalThis)) }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 345,
            columnNumber: 25
          }, globalThis)
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
          lineNumber: 310,
          columnNumber: 21
        }, globalThis),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__meals-section", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "add-meals__section-title", children: "Today's Meals" }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
            lineNumber: 369,
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
                  lineNumber: 378,
                  columnNumber: 37
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "add-meals__meal-type-calories", children: [
                  Math.round(typeCalories),
                  " calories"
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 385,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 377,
                columnNumber: 33
              }, globalThis),
              typeMeals.length > 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__meal-list", children: typeMeals.map((meal) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__meal-item", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__meal-info", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "add-meals__meal-name", children: meal.name }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                    lineNumber: 395,
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
                    lineNumber: 396,
                    columnNumber: 53
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 394,
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
                    lineNumber: 400,
                    columnNumber: 49
                  },
                  globalThis
                )
              ] }, meal.id, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 393,
                columnNumber: 45
              }, globalThis)) }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 391,
                columnNumber: 37
              }, globalThis) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "add-meals__empty-meal-type", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { children: [
                  "No ",
                  mealType,
                  " entries yet"
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                  lineNumber: 411,
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
                    lineNumber: 412,
                    columnNumber: 41
                  },
                  globalThis
                )
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
                lineNumber: 410,
                columnNumber: 37
              }, globalThis)
            ] }, mealType, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
              lineNumber: 376,
              columnNumber: 29
            }, globalThis);
          })
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
          lineNumber: 368,
          columnNumber: 17
        }, globalThis)
      ] }, void 0, true, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
        lineNumber: 188,
        columnNumber: 13
      }, globalThis) }, void 0, false, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/AddMeals.tsx",
        lineNumber: 187,
        columnNumber: 9
      }, globalThis);
    };
    const Profile$1 = "";
    const Profile = () => {
      const { user, signOut } = useAuth();
      const navigate = useNavigate();
      const [profileData, setProfileData] = reactExports.useState({
        height_cm: 0,
        weight_kg: 0,
        target_weight_kg: 0,
        target_duration: 0,
        target_duration_unit: "weeks",
        activity_level: "moderate",
        health_goals: []
      });
      const [isEditing, setIsEditing] = reactExports.useState(false);
      const [heightUnit, setHeightUnit] = reactExports.useState("cm");
      const [weightUnit, setWeightUnit] = reactExports.useState("kg");
      const [targetWeightUnit, setTargetWeightUnit] = reactExports.useState("kg");
      const [heightFeet, setHeightFeet] = reactExports.useState(0);
      const [heightInches, setHeightInches] = reactExports.useState(0);
      const [isLoading, setIsLoading] = reactExports.useState(false);
      const [hasProfile, setHasProfile] = reactExports.useState(false);
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
      }, [user]);
      const loadUserProfile = () => __async(exports, null, function* () {
        if (!user)
          return;
        try {
          const { data } = yield SupabaseService$1.getUserProfile(user.id);
          let additionalData = { target_weight_kg: 0, target_duration: 0, target_duration_unit: "weeks" };
          try {
            const stored = localStorage.getItem(`profile_extra_${user.id}`);
            if (stored) {
              additionalData = JSON.parse(stored);
            }
          } catch (e) {
            console.warn("Failed to load additional profile data:", e);
          }
          if (data) {
            setProfileData({
              height_cm: data.height_cm || 0,
              weight_kg: data.weight_kg || 0,
              target_weight_kg: additionalData.target_weight_kg || 0,
              target_duration: additionalData.target_duration || 0,
              target_duration_unit: additionalData.target_duration_unit || "weeks",
              activity_level: data.activity_level || "moderate",
              health_goals: data.health_goals || []
            });
            setHasProfile(true);
            if (data.height_cm) {
              const feet = Math.floor(data.height_cm / 30.48);
              const inches = Math.round(data.height_cm % 30.48 / 2.54);
              setHeightFeet(feet);
              setHeightInches(inches);
            }
          } else {
            setProfileData({
              height_cm: 0,
              weight_kg: 0,
              target_weight_kg: additionalData.target_weight_kg || 0,
              target_duration: additionalData.target_duration || 0,
              target_duration_unit: additionalData.target_duration_unit || "weeks",
              activity_level: "moderate",
              health_goals: []
            });
            setIsEditing(true);
          }
        } catch (error) {
          console.error("Error loading profile:", error);
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
          dataToSave.activity_level = profileData.activity_level;
          dataToSave.health_goals = profileData.health_goals;
          const additionalData = {
            target_weight_kg: targetWeightUnit === "lbs" ? convertWeight(profileData.target_weight_kg, "lbs", "kg") : profileData.target_weight_kg,
            target_duration: profileData.target_duration,
            target_duration_unit: profileData.target_duration_unit
          };
          localStorage.setItem(`profile_extra_${user.id}`, JSON.stringify(additionalData));
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
      const handleSignOut = reactExports.useCallback(() => __async(exports, null, function* () {
        try {
          yield signOut();
          navigate("/");
        } catch (error) {
          console.error("Error signing out:", error);
          NotificationManager.getInstance().show("Failed to sign out", "error");
        }
      }), [signOut, navigate]);
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__container", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__header", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__user", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__avatar", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "profile__initials", children: getUserInitials() }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 274,
              columnNumber: 29
            }, globalThis) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 273,
              columnNumber: 25
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "profile__info", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "profile__name", children: getUserName() }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 279,
                columnNumber: 29
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "profile__email", children: user == null ? void 0 : user.email }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 280,
                columnNumber: 29
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 278,
              columnNumber: 25
            }, globalThis)
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
            lineNumber: 272,
            columnNumber: 21
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "button",
            {
              className: "profile__signout-btn",
              onClick: handleSignOut,
              "aria-label": "Sign out",
              type: "button",
              children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "profile__signout-icon", children: "🚪" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 289,
                  columnNumber: 25
                }, globalThis),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "profile__signout-text", children: "Sign Out" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 290,
                  columnNumber: 25
                }, globalThis)
              ]
            },
            void 0,
            true,
            {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 283,
              columnNumber: 21
            },
            globalThis
          )
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
          lineNumber: 271,
          columnNumber: 17
        }, globalThis),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__content", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__section", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__section-header", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { children: "Setup Profile" }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 297,
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
                lineNumber: 299,
                columnNumber: 33
              },
              globalThis
            )
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
            lineNumber: 296,
            columnNumber: 25
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__form", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__row", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-group", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-header", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { children: "Height" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 312,
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
                      lineNumber: 313,
                      columnNumber: 41
                    },
                    globalThis
                  )
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 311,
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
                      lineNumber: 324,
                      columnNumber: 45
                    },
                    globalThis
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "profile__unit", children: "cm" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 335,
                    columnNumber: 45
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 323,
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
                        lineNumber: 340,
                        columnNumber: 49
                      },
                      globalThis
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "profile__unit", children: "ft" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 355,
                      columnNumber: 49
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 339,
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
                        lineNumber: 358,
                        columnNumber: 49
                      },
                      globalThis
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "profile__unit", children: "in" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 373,
                      columnNumber: 49
                    }, globalThis)
                  ] }, void 0, true, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 357,
                    columnNumber: 45
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 338,
                  columnNumber: 41
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 310,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-group", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-header", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { children: "Weight" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 381,
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
                      lineNumber: 382,
                      columnNumber: 41
                    },
                    globalThis
                  )
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 380,
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
                      lineNumber: 392,
                      columnNumber: 41
                    },
                    globalThis
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "profile__unit", children: weightUnit }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 407,
                    columnNumber: 41
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 391,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 379,
                columnNumber: 33
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 309,
              columnNumber: 29
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__row", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-group", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-header", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { children: "Target Weight" }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 415,
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
                      lineNumber: 416,
                      columnNumber: 41
                    },
                    globalThis
                  )
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 414,
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
                      lineNumber: 426,
                      columnNumber: 41
                    },
                    globalThis
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "profile__unit", children: targetWeightUnit }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 441,
                    columnNumber: 41
                  }, globalThis)
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 425,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 413,
                columnNumber: 33
              }, globalThis),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-group", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-header", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { children: "Target Duration" }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 447,
                  columnNumber: 41
                }, globalThis) }, void 0, false, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 446,
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
                      lineNumber: 451,
                      columnNumber: 45
                    },
                    globalThis
                  ) }, void 0, false, {
                    fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                    lineNumber: 450,
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
                          lineNumber: 471,
                          columnNumber: 45
                        }, globalThis),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "weeks", children: "Weeks" }, void 0, false, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                          lineNumber: 472,
                          columnNumber: 45
                        }, globalThis),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "months", children: "Months" }, void 0, false, {
                          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                          lineNumber: 473,
                          columnNumber: 45
                        }, globalThis)
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 463,
                      columnNumber: 41
                    },
                    globalThis
                  )
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 449,
                  columnNumber: 37
                }, globalThis)
              ] }, void 0, true, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 445,
                columnNumber: 33
              }, globalThis)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 412,
              columnNumber: 29
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__row", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-group", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "profile__field-header", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { children: "Activity Level" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 482,
                columnNumber: 41
              }, globalThis) }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 481,
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
                      lineNumber: 492,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "light", children: "Light" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 493,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "moderate", children: "Moderate" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 494,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "active", children: "Active" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 495,
                      columnNumber: 41
                    }, globalThis),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "very_active", children: "Very Active" }, void 0, false, {
                      fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                      lineNumber: 496,
                      columnNumber: 41
                    }, globalThis)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 484,
                  columnNumber: 37
                },
                globalThis
              )
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 480,
              columnNumber: 33
            }, globalThis) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
              lineNumber: 479,
              columnNumber: 29
            }, globalThis)
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
            lineNumber: 308,
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
                    lineNumber: 512,
                    columnNumber: 49
                  }, globalThis),
                  "Updating..."
                ] }, void 0, true, {
                  fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                  lineNumber: 511,
                  columnNumber: 45
                }, globalThis) : hasProfile ? "Update Profile" : "Save Profile"
              },
              void 0,
              false,
              {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
                lineNumber: 505,
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
                lineNumber: 520,
                columnNumber: 41
              },
              globalThis
            )
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
            lineNumber: 504,
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
              lineNumber: 531,
              columnNumber: 37
            },
            globalThis
          ) }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
            lineNumber: 502,
            columnNumber: 25
          }, globalThis)
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
          lineNumber: 295,
          columnNumber: 21
        }, globalThis) }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
          lineNumber: 294,
          columnNumber: 17
        }, globalThis)
      ] }, void 0, true, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
        lineNumber: 270,
        columnNumber: 13
      }, globalThis) }, void 0, false, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/pages/Profile.tsx",
        lineNumber: 269,
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
    const ProtectedRoute = ({ children, requireAdmin = false, fallback = null }) => {
      const { loading, isAuthenticated, isAdmin, user } = useAuth();
      if (loading) {
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "protected-route protected-route--loading", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoadingSpinner, {}, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
          lineNumber: 20,
          columnNumber: 17
        }, globalThis) }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
          lineNumber: 19,
          columnNumber: 13
        }, globalThis);
      }
      if (requireAdmin && !isAdmin) {
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "protected-route protected-route--unauthorized", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "protected-route__container", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "protected-route__title", children: "Access Denied" }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
            lineNumber: 33,
            columnNumber: 21
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "protected-route__message", children: "You don't have admin privileges to access this area." }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
            lineNumber: 34,
            columnNumber: 21
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "protected-route__user-info", children: [
            "Signed in as: ",
            user == null ? void 0 : user.email
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
            lineNumber: 37,
            columnNumber: 21
          }, globalThis)
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
          lineNumber: 32,
          columnNumber: 17
        }, globalThis) }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
          lineNumber: 31,
          columnNumber: 13
        }, globalThis);
      }
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children }, void 0, false, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/components/auth/ProtectedRoute.tsx",
        lineNumber: 45,
        columnNumber: 12
      }, globalThis);
    };
    const useNavigation = (options = {}) => {
      const { autoInit = true, onStateChange } = options;
      const managerRef = reactExports.useRef(null);
      const unsubscribeRef = reactExports.useRef(null);
      const onStateChangeRef = reactExports.useRef(onStateChange);
      onStateChangeRef.current = onStateChange;
      const [state, setState] = reactExports.useState(() => ({
        isOpen: false,
        activeItem: "home",
        hoveredItem: null,
        focusedItem: null,
        keyboardMode: false,
        isAnimating: false
      }));
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
            lineNumber: 35,
            columnNumber: 7
          },
          globalThis
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("main", { className: "app__main", children }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 43,
          columnNumber: 7
        }, globalThis),
        showFooter && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("footer", { className: "app__footer", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "app__footer-content", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "app__footer-main", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "app__footer-brand", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("strong", { children: appConfig.name }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 53,
              columnNumber: 17
            }, globalThis),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Your health journey starts here" }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 54,
              columnNumber: 17
            }, globalThis)
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
            lineNumber: 52,
            columnNumber: 15
          }, globalThis) }, void 0, false, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
            lineNumber: 51,
            columnNumber: 13
          }, globalThis),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "app__footer-bottom", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
              "© 2025 ",
              appConfig.name
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 58,
              columnNumber: 15
            }, globalThis),
            appConfig.debug.enabled && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "app__footer-version", children: [
              "v",
              appConfig.version
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 60,
              columnNumber: 17
            }, globalThis)
          ] }, void 0, true, {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
            lineNumber: 57,
            columnNumber: 13
          }, globalThis)
        ] }, void 0, true, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 50,
          columnNumber: 11
        }, globalThis) }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 49,
          columnNumber: 9
        }, globalThis)
      ] }, void 0, true, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
        lineNumber: 33,
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
          lineNumber: 97,
          columnNumber: 7
        },
        globalThis
      ) }, void 0, false, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
        lineNumber: 96,
        columnNumber: 5
      }, globalThis);
    };
    function App() {
      const [isLoading, setIsLoading] = reactExports.useState(true);
      const auth = useAuth();
      useAuthNavigation(auth.isAuthenticated, auth.loading);
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
            lineNumber: 191,
            columnNumber: 7
          },
          this
        );
      }
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(BrowserRouter, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Layout, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Routes, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "/", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(HomePage, {}, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 204,
          columnNumber: 36
        }, this) }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 204,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "/auth/callback", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AuthCallback, {}, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 207,
          columnNumber: 49
        }, this) }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 207,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Route,
          {
            path: "/add-meals",
            element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AddMeals, {}, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 214,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 213,
              columnNumber: 15
            }, this)
          },
          void 0,
          false,
          {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
            lineNumber: 210,
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
              lineNumber: 224,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 223,
              columnNumber: 15
            }, this)
          },
          void 0,
          false,
          {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
            lineNumber: 220,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Route,
          {
            path: "/journal",
            element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { id: "journal", className: "app__section", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "app__container", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "section-placeholder", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { children: "📝 Health Journal Section" }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
                lineNumber: 237,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { children: "This section will be implemented with health journal functionality." }, void 0, false, {
                fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
                lineNumber: 238,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 236,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 235,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 234,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
              lineNumber: 233,
              columnNumber: 15
            }, this)
          },
          void 0,
          false,
          {
            fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
            lineNumber: 230,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Route, { path: "*", element: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Navigate, { to: "/", replace: true }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 247,
          columnNumber: 36
        }, this) }, void 0, false, {
          fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
          lineNumber: 247,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
        lineNumber: 202,
        columnNumber: 9
      }, this) }, void 0, false, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
        lineNumber: 201,
        columnNumber: 7
      }, this) }, void 0, false, {
        fileName: "F:/wamp/www/gamingdronzz.com-health/app/src/App.tsx",
        lineNumber: 200,
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
