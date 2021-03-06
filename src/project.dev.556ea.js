window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  AudioController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1d6d0OoirhGUovLXt4pSNNX", "AudioController");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var HashMap_1 = require("../utils/HashMap");
    var EventManager_1 = require("./EventManager");
    var EventName_1 = require("./EventName");
    var Game_1 = require("./Game");
    var AudioController = function() {
      function AudioController() {
        this.audioID = {};
        this.clips = new HashMap_1.HashMap();
      }
      Object.defineProperty(AudioController, "inst", {
        get: function() {
          return this.ins ? this.ins : this.ins = new AudioController();
        },
        enumerable: true,
        configurable: true
      });
      AudioController.prototype.init = function(callback) {
        console.warn(" start load AudioClip ");
        var self = this;
        cc.loader.loadResDir("preLoadSounds", cc.AudioClip, function(err, clips, urls) {
          if (err) console.error(err); else {
            for (var _i = 0, clips_1 = clips; _i < clips_1.length; _i++) {
              var clip = clips_1[_i];
              self.clips.add(clip.name, clip);
            }
            self.initEvent();
            callback && callback();
          }
        });
      };
      AudioController.prototype.initEvent = function() {
        var _this = this;
        EventManager_1.gEventMgr.targetOff(this);
        this.audioID["bgm"] = this.play("bgm", true, 2, true);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.SMALL_BGM, function() {
          null != _this.audioID["bgm"] && cc.audioEngine.setVolume(_this.audioID["bgm"], .9);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.NORMAL_BGM, function() {
          null != _this.audioID["bgm"] && cc.audioEngine.setVolume(_this.audioID["bgm"], 2);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PLAY_RECYCLE_POKERS, function() {
          _this.play("recyclePoker");
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.DEV_POKERS, function() {
          _this.play("devPoker");
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PLAY_POKER_PLACE, function() {
          _this.play("pokerPlace");
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PLAY_RECYCLE, function() {
          _this.play("recycle" + Game_1.Game.getCombo(), false, 4);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PLAY_POKER_FLY, function() {
          _this.play("pokerFly");
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PLAY_OVER_1, function() {
          _this.play("result_flip");
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PLAY_OVER_2, function() {
          _this.play("result_dev", false, 2);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PLAY_PAUSE, function() {
          _this.play("pause");
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PLAY_SHAKE, function() {
          _this.play("shake", false, .7);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PLAY_START, function() {
          _this.play("start_count");
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PLAY_BUST, function() {
          _this.play("bust", false, 2.5);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PLAY_CHANGE_2_WILD, function() {
          _this.play("change2wild");
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PLAY_WILD_ANI, function() {
          _this.play("wild_ani");
        }, this);
      };
      AudioController.prototype.stop = function(audioID, clipName) {
        if (AudioController.canPlay) cc.audioEngine.stop(audioID); else for (var _i = 0, _a = AudioController.PlayedList; _i < _a.length; _i++) {
          var clipItem = _a[_i];
          clipItem.skip = clipItem.clipName == clipName;
        }
      };
      AudioController.prototype.play = function(clipName, loop, volume, isBgm, timePass) {
        var _this = this;
        void 0 === loop && (loop = false);
        void 0 === volume && (volume = 1);
        void 0 === isBgm && (isBgm = false);
        void 0 === timePass && (timePass = 0);
        if (!AudioController.canPlay && !AudioController.hasBindTouch) {
          AudioController.hasBindTouch = true;
          var self_1 = this;
          var playFunc_1 = function() {
            cc.game.canvas.removeEventListener("touchstart", playFunc_1);
            AudioController.canPlay = true;
            var item;
            while ((item = AudioController.PlayedList.pop()) && self_1.clips.get(item.clipName) && !item.skip) {
              var audioID = cc.audioEngine.play(self_1.clips.get(item.clipName), item.loop, item.volume);
              if (item.isBgm) {
                self_1.audioID["bgm"] = audioID;
                cc.audioEngine.setCurrentTime(audioID, (Date.now() - item.supTime) / 1e3 % cc.audioEngine.getDuration(audioID));
              } else cc.audioEngine.setCurrentTime(audioID, (Date.now() - item.supTime) / 1e3);
            }
          };
          cc.game.canvas.addEventListener("touchstart", playFunc_1);
        }
        if (!this.clips.get(clipName)) {
          var now_1 = Date.now();
          cc.loader.loadRes("sounds/" + clipName, cc.AudioClip, function(err, clip) {
            if (err) console.error(err); else {
              _this.clips.add(clip.name, clip);
              var pass = (Date.now() - now_1) / 1e3;
              _this.audioID[clipName] = _this.play(clipName, loop, volume, isBgm, pass);
            }
          });
          return -1;
        }
        if (AudioController.canPlay) {
          var audioID = cc.audioEngine.play(this.clips.get(clipName), loop, volume);
          cc.audioEngine.setCurrentTime(audioID, timePass % cc.audioEngine.getDuration(audioID));
          return audioID;
        }
        AudioController.PlayedList.push({
          clipName: clipName,
          loop: loop,
          volume: volume,
          supTime: Date.now() - timePass / 1e3,
          skip: false,
          isBgm: isBgm
        });
        return -2;
      };
      AudioController.PlayedList = [];
      AudioController.canPlay = cc.sys.os.toLowerCase() != cc.sys.OS_IOS.toLowerCase();
      AudioController.hasBindTouch = false;
      return AudioController;
    }();
    exports.gAudio = AudioController.inst;
    cc._RF.pop();
  }, {
    "../utils/HashMap": "HashMap",
    "./EventManager": "EventManager",
    "./EventName": "EventName",
    "./Game": "Game"
  } ],
  EventManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "15a47pj/bZLz4bw5c1lt4L9", "EventManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventManager = function() {
      function EventManager() {
        this.eventTarget = new cc.EventTarget();
      }
      Object.defineProperty(EventManager, "inst", {
        get: function() {
          return this.ins ? this.ins : this.ins = new EventManager();
        },
        enumerable: true,
        configurable: true
      });
      EventManager.prototype.emit = function(type, arg1, arg2, arg3, arg4, arg5) {
        this.eventTarget.emit(type.toString(), arg1, arg2, arg3, arg4, arg5);
      };
      EventManager.prototype.on = function(type, callback, target, useCapture) {
        return this.eventTarget.on(type.toString(), callback, target, useCapture);
      };
      EventManager.prototype.once = function(type, callback, target) {
        this.eventTarget.once(type.toString(), callback, target);
      };
      EventManager.prototype.dispatchEvent = function(event) {
        this.eventTarget.dispatchEvent(event);
      };
      EventManager.prototype.off = function(type, callback, target) {
        this.eventTarget.off(type.toString(), callback, target);
      };
      EventManager.prototype.hasEventListener = function(type) {
        return this.eventTarget.hasEventListener(type.toString());
      };
      EventManager.prototype.targetOff = function(target) {
        this.eventTarget.targetOff(target);
      };
      return EventManager;
    }();
    exports.gEventMgr = EventManager.inst;
    cc._RF.pop();
  }, {} ],
  EventName: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bf67a7QRNNGpo1qJkcJdq4+", "EventName");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GlobalEvent;
    (function(GlobalEvent) {
      GlobalEvent[GlobalEvent["UPDATE_DRAW_ICON"] = 0] = "UPDATE_DRAW_ICON";
      GlobalEvent[GlobalEvent["UPDATE_SCORE"] = 1] = "UPDATE_SCORE";
      GlobalEvent[GlobalEvent["UPDATE_BACK_BTN_ICON"] = 2] = "UPDATE_BACK_BTN_ICON";
      GlobalEvent[GlobalEvent["UPDATE_RECYCLE_POKER"] = 3] = "UPDATE_RECYCLE_POKER";
      GlobalEvent[GlobalEvent["OPEN_RESULT"] = 4] = "OPEN_RESULT";
      GlobalEvent[GlobalEvent["RESTART"] = 5] = "RESTART";
      GlobalEvent[GlobalEvent["COMPLETE"] = 6] = "COMPLETE";
      GlobalEvent[GlobalEvent["AUTO_COMPLETE_DONE"] = 7] = "AUTO_COMPLETE_DONE";
      GlobalEvent[GlobalEvent["UPDATE_CUR_SELECT_POKER"] = 8] = "UPDATE_CUR_SELECT_POKER";
      GlobalEvent[GlobalEvent["UPDATE_WILD_COUNT"] = 9] = "UPDATE_WILD_COUNT";
      GlobalEvent[GlobalEvent["UPDATE_STREAK_COUNT"] = 10] = "UPDATE_STREAK_COUNT";
      GlobalEvent[GlobalEvent["BUST"] = 11] = "BUST";
      GlobalEvent[GlobalEvent["COMPLETE_21"] = 12] = "COMPLETE_21";
      GlobalEvent[GlobalEvent["OVER_FIVE_CARDS"] = 13] = "OVER_FIVE_CARDS";
      GlobalEvent[GlobalEvent["COMBO"] = 14] = "COMBO";
      GlobalEvent[GlobalEvent["SUPER_COMBO"] = 15] = "SUPER_COMBO";
      GlobalEvent[GlobalEvent["WILD"] = 16] = "WILD";
      GlobalEvent[GlobalEvent["NO_BUST"] = 17] = "NO_BUST";
      GlobalEvent[GlobalEvent["CHECK_COMPLETE"] = 18] = "CHECK_COMPLETE";
      GlobalEvent[GlobalEvent["PLAY_RECYCLE_POKERS"] = 19] = "PLAY_RECYCLE_POKERS";
      GlobalEvent[GlobalEvent["DEV_POKERS"] = 20] = "DEV_POKERS";
      GlobalEvent[GlobalEvent["PLAY_POKER_PLACE"] = 21] = "PLAY_POKER_PLACE";
      GlobalEvent[GlobalEvent["PLAY_POKER_FLY"] = 22] = "PLAY_POKER_FLY";
      GlobalEvent[GlobalEvent["PLAY_OVER_1"] = 23] = "PLAY_OVER_1";
      GlobalEvent[GlobalEvent["PLAY_OVER_2"] = 24] = "PLAY_OVER_2";
      GlobalEvent[GlobalEvent["PLAY_PAUSE"] = 25] = "PLAY_PAUSE";
      GlobalEvent[GlobalEvent["PLAY_START"] = 26] = "PLAY_START";
      GlobalEvent[GlobalEvent["PLAY_SHAKE"] = 27] = "PLAY_SHAKE";
      GlobalEvent[GlobalEvent["PLAY_BUST"] = 28] = "PLAY_BUST";
      GlobalEvent[GlobalEvent["SMALL_BGM"] = 29] = "SMALL_BGM";
      GlobalEvent[GlobalEvent["NORMAL_BGM"] = 30] = "NORMAL_BGM";
      GlobalEvent[GlobalEvent["PLAY_RECYCLE"] = 31] = "PLAY_RECYCLE";
      GlobalEvent[GlobalEvent["PLAY_CHANGE_2_WILD"] = 32] = "PLAY_CHANGE_2_WILD";
      GlobalEvent[GlobalEvent["PLAY_WILD_ANI"] = 33] = "PLAY_WILD_ANI";
      GlobalEvent[GlobalEvent["POP_GUIDE_STEP"] = 34] = "POP_GUIDE_STEP";
    })(GlobalEvent = exports.GlobalEvent || (exports.GlobalEvent = {}));
    cc._RF.pop();
  }, {} ],
  GameFactory: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "44968IEriNJurc3wbMrKqft", "GameFactory");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var HashMap_1 = require("../utils/HashMap");
    var ObjPool = function() {
      function ObjPool(template, initSize, poolHandlerComps) {
        this._pool = [];
        this.poolHandlerComps = [];
        this.poolHandlerComps = poolHandlerComps;
        this.template = template;
        this.initPool(initSize);
      }
      ObjPool.prototype.initPool = function(size) {
        for (var i = 0; i < size; ++i) {
          var newNode = cc.instantiate(this.template);
          this.put(newNode);
        }
      };
      ObjPool.prototype.size = function() {
        return this._pool.length;
      };
      ObjPool.prototype.clear = function() {
        var count = this._pool.length;
        for (var i = 0; i < count; ++i) this._pool[i].destroy && this._pool[i].destroy();
        this._pool.length = 0;
      };
      ObjPool.prototype.put = function(obj) {
        if (obj && -1 === this._pool.indexOf(obj)) {
          obj.removeFromParent(false);
          if (this.poolHandlerComps) {
            var handlers = this.poolHandlerComps;
            for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
              var handler = handlers_1[_i];
              var comp = obj.getComponent(handler);
              comp && comp.unuse && comp.unuse.apply(comp);
            }
          } else {
            var handlers = obj.getComponents(cc.Component);
            for (var _a = 0, handlers_2 = handlers; _a < handlers_2.length; _a++) {
              var handler = handlers_2[_a];
              handler && handler.unuse && handler.unuse.apply(handler);
            }
          }
          this._pool.push(obj);
        }
      };
      ObjPool.prototype.get = function() {
        var _ = [];
        for (var _i = 0; _i < arguments.length; _i++) _[_i] = arguments[_i];
        var last = this._pool.length - 1;
        if (last < 0) {
          console.warn(" last < 0 ");
          this.initPool(1);
        }
        last = this._pool.length - 1;
        var obj = this._pool[last];
        this._pool.length = last;
        if (this.poolHandlerComps) {
          var handlers = this.poolHandlerComps;
          for (var _a = 0, handlers_3 = handlers; _a < handlers_3.length; _a++) {
            var handler = handlers_3[_a];
            var comp = obj.getComponent(handler);
            comp && comp.reuse && comp.reuse.apply(comp, arguments);
          }
        } else {
          var handlers = obj.getComponents(cc.Component);
          for (var _b = 0, handlers_4 = handlers; _b < handlers_4.length; _b++) {
            var handler = handlers_4[_b];
            handler && handler.reuse && handler.reuse.apply(handler, arguments);
          }
        }
        return obj;
      };
      return ObjPool;
    }();
    var Step;
    (function(Step) {
      Step[Step["INIT"] = 0] = "INIT";
      Step[Step["POKER"] = 4] = "POKER";
      Step[Step["AddScore"] = 8] = "AddScore";
      Step[Step["SubScore"] = 16] = "SubScore";
      Step[Step["SpecialFont"] = 32] = "SpecialFont";
      Step[Step["DONE"] = 60] = "DONE";
    })(Step || (Step = {}));
    var GameFactory = function() {
      function GameFactory() {
        this.step = Step.INIT;
        this.SpecialPool = new HashMap_1.HashMap();
        this.PokerPool = new HashMap_1.HashMap();
        this.addScorePool = new HashMap_1.HashMap();
        this.subScorePool = new HashMap_1.HashMap();
      }
      Object.defineProperty(GameFactory, "inst", {
        get: function() {
          return this.ins ? this.ins : this.ins = new GameFactory();
        },
        enumerable: true,
        configurable: true
      });
      GameFactory.prototype.init = function(callback, poker, addScoreLabel, subScoreLabel, specialFont) {
        this.doneCallback = callback;
        this.initPoker(52, poker);
        this.initAddScore(10, addScoreLabel);
        this.initSubScore(10, subScoreLabel);
        this.initSpecial(10, specialFont);
      };
      GameFactory.prototype.nextStep = function(step) {
        this.step |= step;
        this.step >= Step.DONE && this.doneCallback && this.doneCallback();
      };
      GameFactory.prototype.initSpecial = function(initCount, prefab) {
        var self = this;
        if (prefab) {
          self.SpecialPool.add("Special", new ObjPool(prefab, initCount));
          self.nextStep(Step.SpecialFont);
        } else cc.loader.loadRes("prefabs/SpecialFont", cc.Prefab, function(err, prefabRes) {
          if (err) console.error(err); else {
            self.SpecialPool.add("Special", new ObjPool(prefabRes, initCount));
            self.nextStep(Step.SpecialFont);
          }
        });
      };
      GameFactory.prototype.getSpecialFont = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        return this.SpecialPool.get("Special").get(args);
      };
      GameFactory.prototype.putSpecialFont = function(poker) {
        this.SpecialPool.get("Special").put(poker);
      };
      GameFactory.prototype.initPoker = function(initCount, prefab) {
        var self = this;
        if (prefab) {
          self.PokerPool.add("Poker", new ObjPool(prefab, initCount));
          self.nextStep(Step.POKER);
        } else cc.loader.loadRes("prefabs/poker", cc.Prefab, function(err, prefabRes) {
          if (err) console.error(err); else {
            self.PokerPool.add("Poker", new ObjPool(prefabRes, initCount));
            self.nextStep(Step.POKER);
          }
        });
      };
      GameFactory.prototype.getPoker = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        return this.PokerPool.get("Poker").get(args);
      };
      GameFactory.prototype.putPoker = function(poker) {
        this.PokerPool.get("Poker").put(poker);
      };
      GameFactory.prototype.initAddScore = function(initCount, prefab) {
        var self = this;
        if (prefab) {
          self.addScorePool.add("AddScore", new ObjPool(prefab, initCount));
          self.nextStep(Step.AddScore);
        } else cc.loader.loadRes("prefabs/AddScoreLabel", cc.Prefab, function(err, prefabRes) {
          if (err) console.error(err); else {
            self.addScorePool.add("AddScore", new ObjPool(prefabRes, initCount));
            self.nextStep(Step.AddScore);
          }
        });
      };
      GameFactory.prototype.getAddScore = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        return this.addScorePool.get("AddScore").get(args);
      };
      GameFactory.prototype.putAddScore = function(poker) {
        this.addScorePool.get("AddScore").put(poker);
      };
      GameFactory.prototype.initSubScore = function(initCount, prefab) {
        var self = this;
        if (prefab) {
          self.subScorePool.add("SubScore", new ObjPool(prefab, initCount));
          self.nextStep(Step.SubScore);
        } else cc.loader.loadRes("prefabs/SubScoreLabel", cc.Prefab, function(err, prefabRes) {
          if (err) console.error(err); else {
            self.subScorePool.add("SubScore", new ObjPool(prefabRes, initCount));
            self.nextStep(Step.SubScore);
          }
        });
      };
      GameFactory.prototype.getSubScore = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        return this.subScorePool.get("SubScore").get(args);
      };
      GameFactory.prototype.putSubScore = function(poker) {
        this.subScorePool.get("SubScore").put(poker);
      };
      return GameFactory;
    }();
    exports.gFactory = GameFactory.inst;
    cc._RF.pop();
  }, {
    "../utils/HashMap": "HashMap"
  } ],
  GameScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e1b90/rohdEk4SdmmEZANaD", "GameScene");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameFactory_1 = require("./controller/GameFactory");
    var Game_1 = require("./controller/Game");
    var Poker_1 = require("./Poker");
    var Pokers_1 = require("./Pokers");
    var EventManager_1 = require("./controller/EventManager");
    var EventName_1 = require("./controller/EventName");
    var Stop_1 = require("./Stop");
    var AudioController_1 = require("./controller/AudioController");
    var Guide_1 = require("./Guide");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var celerx = require("./utils/celerx");
    var LOAD_STEP;
    (function(LOAD_STEP) {
      LOAD_STEP[LOAD_STEP["READY"] = 0] = "READY";
      LOAD_STEP[LOAD_STEP["PREFABS"] = 2] = "PREFABS";
      LOAD_STEP[LOAD_STEP["AUDIO"] = 16] = "AUDIO";
      LOAD_STEP[LOAD_STEP["CELER"] = 32] = "CELER";
      LOAD_STEP[LOAD_STEP["GUIDE"] = 64] = "GUIDE";
      LOAD_STEP[LOAD_STEP["CELER_READY"] = 18] = "CELER_READY";
      LOAD_STEP[LOAD_STEP["GUIDE_READY"] = 50] = "GUIDE_READY";
      LOAD_STEP[LOAD_STEP["DONE"] = 114] = "DONE";
    })(LOAD_STEP = exports.LOAD_STEP || (exports.LOAD_STEP = {}));
    var GameScene = function(_super) {
      __extends(GameScene, _super);
      function GameScene() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.Poker = null;
        _this.Top = null;
        _this.PlaceBack = null;
        _this.TouchRoot = null;
        _this.ValueRootNode = null;
        _this.PokerClip = null;
        _this.PlaceRoot = null;
        _this.PokerDevl = null;
        _this.RemoveNode = null;
        _this.BackButton = null;
        _this.Bust01 = null;
        _this.Bust02 = null;
        _this.Bust03 = null;
        _this.PauseButton = null;
        _this.BackButtonAtlas = null;
        _this.TimeLabel = null;
        _this.TimeIcon = null;
        _this.TimeIconAtlas = null;
        _this.ScoreLabel = null;
        _this.SmallOrg = null;
        _this.SmallWhite = null;
        _this.SubScoreLabel = null;
        _this.AddScoreLabel = null;
        _this.SpecialFont = null;
        _this.TimeAnimation = null;
        _this.Stop = null;
        _this.Guide = null;
        _this.Complete = null;
        _this.SubmitButton = null;
        _this.CheatToggle = null;
        _this.PokerRestLabel = null;
        _this.SelectPokerNode = null;
        _this.SpecialWild = null;
        _this.SpecialBust = null;
        _this.SpecialAtlas = null;
        _this.SpecialScore = null;
        _this.RemoveCardNode = null;
        _this.RemoveBustNode = null;
        _this.WildBtn = null;
        _this.WildCount = null;
        _this.CompleteAtlas = null;
        _this.CompleteSprite = null;
        _this.combo1 = null;
        _this.combo2 = null;
        _this.AddWildEffect = null;
        _this.step = LOAD_STEP.READY;
        _this.canDispatchPoker = false;
        _this.dispatchCardCount = 38;
        _this.devTime = 10;
        _this.backTime = 10;
        _this.score = 0;
        _this.showScore = 0;
        _this.scoreStep = 0;
        _this.isStart = false;
        _this.isNewPlayer = false;
        _this.guideDone = false;
        _this.isCeler = false;
        return _this;
      }
      GameScene.prototype.init = function() {
        this.Stop.hide();
        this.Complete.node.active = false;
        this.TimeLabel.string = CMath.TimeFormat(Game_1.Game.getGameTime());
        this.ScoreLabel.string = "0";
        this.TimeAnimation.node.active = false;
        this.TimeIcon.spriteFrame = this.TimeIconAtlas.getSpriteFrame("icon_time");
        Game_1.Game.getCycledPokerRoot().clear();
        Game_1.Game.getPlacePokerRoot().clear();
        for (var _i = 0, _a = this.PlaceRoot.children; _i < _a.length; _i++) {
          var child = _a[_i];
          child.getComponent(cc.Sprite) && child.getComponent(cc.Sprite).enabled && (child.getComponent(cc.Sprite).enabled = true);
          Game_1.Game.addPlacePokerRoot(parseInt(child.name), child);
        }
      };
      GameScene.prototype.registerGuide = function() {
        var _this = this;
        this.Guide.register([ {
          touches: [ {
            node: this.Top
          }, {
            node: this.PlaceBack
          }, {
            node: null,
            nodeFunc: function() {
              var poker = Game_1.Game.getCurSelectPoker();
              if (poker) return poker.node;
              return null;
            }
          }, {
            node: this.ValueRootNode.children[0]
          }, {
            node: this.TouchRoot.children[0].children[0],
            isAction: true
          }, {
            node: this.TouchRoot.children[0]
          } ]
        }, {
          touches: [ {
            node: this.TouchRoot.children[0]
          } ]
        }, {
          touches: [ {
            node: this.TouchRoot.children[0].children[0]
          }, {
            node: this.ValueRootNode.children[1]
          }, {
            node: this.TouchRoot.children[1]
          }, {
            node: this.TouchRoot.children[1].children[0],
            isAction: true
          } ]
        }, {
          touches: [ {
            node: this.TouchRoot.children[0].children[0],
            isAction: true,
            end: function() {
              _this.TouchRoot.children[0].children[0].group = "default";
            }
          }, {
            node: this.TouchRoot.children[0],
            end: function() {
              _this.TouchRoot.children[0].group = "default";
            }
          }, {
            node: this.ValueRootNode.children[0],
            end: function() {
              _this.ValueRootNode.children[0].group = "default";
            }
          } ]
        }, {
          touches: [ {
            node: this.TouchRoot.children[1],
            end: function() {
              _this.TouchRoot.children[1].group = "default";
            }
          }, {
            node: this.TouchRoot.children[1].children[0],
            isAction: true,
            end: function() {
              _this.TouchRoot.children[1].children[0].group = "default";
            }
          }, {
            node: this.ValueRootNode.children[1],
            end: function() {
              _this.ValueRootNode.children[1].group = "default";
            }
          } ]
        }, {
          touches: [ {
            node: this.TouchRoot.children[0].children[0],
            isAction: true
          }, {
            node: this.TouchRoot.children[0]
          }, {
            node: this.ValueRootNode.children[0]
          } ]
        }, {
          touches: [ {
            node: this.TouchRoot.children[0].children[0],
            isAction: true,
            end: function() {
              _this.TouchRoot.children[0].children[0].group = "default";
            }
          }, {
            node: this.TouchRoot.children[0],
            end: function() {
              _this.TouchRoot.children[0].group = "default";
            }
          }, {
            node: this.ValueRootNode.children[0],
            end: function() {
              _this.ValueRootNode.children[0].group = "default";
            }
          }, {
            node: this.Top,
            end: function() {
              _this.Top.group = "default";
            }
          }, {
            node: this.PlaceBack,
            end: function() {
              _this.PlaceBack.group = "default";
            }
          } ]
        } ]);
      };
      GameScene.prototype.onLoad = function() {
        var _this = this;
        Game_1.Game.removeNode = this.RemoveNode;
        Game_1.Game.pokerClip = this.PokerClip;
        Game_1.Game.removeCardNode = this.RemoveCardNode;
        Game_1.Game.removeBustedNode = this.RemoveBustNode;
        Game_1.Game.curSelectNode = this.SelectPokerNode;
        this.combo1.node.active = false;
        this.combo2.node.active = false;
        this.CompleteSprite.node.active = false;
        this.Bust01.getChildByName("Cover").active = false;
        this.Bust02.getChildByName("Cover").active = false;
        this.Bust03.getChildByName("Cover").active = false;
        this.WildCount.string = Game_1.Game.getWildCount().toString();
        CMath.randomSeed = Math.random();
        var self = this;
        celerx.onStart(function() {
          self.celerStart();
        }.bind(this));
        celerx.provideScore(function() {
          return parseInt(Game_1.Game.getScore().toString());
        });
        for (var _i = 0, _a = this.SpecialBust.children; _i < _a.length; _i++) {
          var child = _a[_i];
          child.scaleY = 0;
        }
        for (var _b = 0, _c = this.SpecialWild.children; _b < _c.length; _b++) {
          var child = _c[_b];
          child.scaleY = 0;
        }
        this.CheatToggle.node.active = CHEAT_OPEN;
        this.CheatToggle.isChecked = false;
        this.CheatToggle.node.on("toggle", function() {
          _this.CheatToggle.isChecked ? window["noTime"] = window["CheatOpen"] = true : window["noTime"] = window["CheatOpen"] = false;
        }, this);
        this.init();
        GameFactory_1.gFactory.init(function() {
          this.nextStep(LOAD_STEP.PREFABS);
        }.bind(this), this.Poker, this.AddScoreLabel, this.SubScoreLabel, this.SpecialFont);
        AudioController_1.gAudio.init(function() {
          _this.nextStep(LOAD_STEP.AUDIO);
        });
        this.PokerClip.on(cc.Node.EventType.TOUCH_CANCEL, function() {
          if (Game_1.Game.isTimeOver() || Game_1.Game.isComplete()) return;
          if (_this.devTime >= .3) {
            _this.dispatchPoker();
            _this.devTime = 0;
          }
        }, this);
        true;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function(event) {
          switch (event.keyCode) {
           case cc.macro.KEY.space:
            Game_1.Game.getCurSelectPoker() && Game_1.Game.getCurSelectPoker().setWild();
          }
        });
        this.PauseButton.node.on(cc.Node.EventType.TOUCH_END, function() {
          if (Game_1.Game.isComplete()) return;
          _this.Stop.show(-1);
          Game_1.Game.setPause(true);
        }, this);
        this.SubmitButton.interactable = Game_1.Game.getWildCount() > 0;
        this.WildCount.node.getParent().active = this.SubmitButton.interactable;
        this.SubmitButton.interactable ? this.SubmitButton.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.WildBtn.getSpriteFrame("btn_wild") : this.SubmitButton.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.WildBtn.getSpriteFrame("btn_wildnone");
        this.SubmitButton.node.on(cc.Node.EventType.TOUCH_END, function() {
          if (Game_1.Game.isComplete()) return;
          if (Game_1.Game.getWildCount() <= 0 || !Game_1.Game.getCurSelectPoker()) return;
          Game_1.Game.getCurSelectPoker().setWild();
          Game_1.Game.addWildCount(-1);
          Game_1.Game.clearStreak();
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.UPDATE_STREAK_COUNT, function() {
          _this.combo1.node.active = Game_1.Game.getStreak() >= 2 && 0 == Game_1.Game.getWildCount();
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.UPDATE_WILD_COUNT, function(wild) {
          if (wild > 0) {
            EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PLAY_WILD_ANI);
            _this.AddWildEffect.play();
          }
          _this.WildCount.string = Game_1.Game.getWildCount().toString();
          _this.SubmitButton.interactable = Game_1.Game.getWildCount() > 0;
          _this.WildCount.node.getParent().active = _this.SubmitButton.interactable;
          if (_this.SubmitButton.interactable) if (1 == Game_1.Game.getWildCount()) {
            _this.combo2.node.active = true;
            setTimeout(function() {
              Game_1.Game.getWildCount() > 0 && (_this.SubmitButton.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = _this.WildBtn.getSpriteFrame("btn_wild"));
              _this.combo2.node.active = false;
            }, 300);
          } else {
            _this.combo2.node.active = false;
            _this.SubmitButton.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = _this.WildBtn.getSpriteFrame("btn_wild");
          } else _this.SubmitButton.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = _this.WildBtn.getSpriteFrame("btn_wildnone");
        }, this);
        this.PokerDevl.on(cc.Node.EventType.CHILD_ADDED, function(child) {
          var poker = child.getComponent(Poker_1.default);
          poker && poker.setRecycle(false);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.COMPLETE, function() {
          _this.Complete.node.active = true;
          _this.Complete.play();
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.UPDATE_RECYCLE_POKER, function(count) {
          console.log(" BOOM count: ", count);
          _this.Bust01.getChildByName("Cover").active = count >= 1;
          _this.Bust02.getChildByName("Cover").active = count >= 2;
          _this.Bust03.getChildByName("Cover").active = count >= 3;
        }, this);
        this.BackButton.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.BackButtonAtlas.getSpriteFrame("btn_backgray");
        this.BackButton.interactable = false;
        this.BackButton.node.on(cc.Node.EventType.TOUCH_START, function() {
          if (Game_1.Game.isTimeOver() || _this.backTime < .5 || Game_1.Game.isComplete()) return;
          _this.backTime = 0;
          Game_1.Game.backStep() && Game_1.Game.addScore(-Pokers_1.BACK_STEP_SCORE, CMath.ConvertToNodeSpaceAR(_this.BackButton.node, Game_1.Game.removeNode));
        }, Game_1.Game);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.UPDATE_BACK_BTN_ICON, function() {
          _this.BackButton.interactable = Game_1.Game.canBackStep();
          _this.BackButton.interactable ? _this.BackButton.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = _this.BackButtonAtlas.getSpriteFrame("btn_back") : _this.BackButton.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = _this.BackButtonAtlas.getSpriteFrame("btn_backgray");
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.UPDATE_SCORE, function(score, pos) {
          _this.scoreStep = Math.ceil(Math.max(score / 20, _this.scoreStep));
          var targetPos = CMath.ConvertToNodeSpaceAR(_this.ScoreLabel.node, _this.RemoveNode);
          if (score > 0) {
            var scoreLabel_1 = GameFactory_1.gFactory.getAddScore("/" + score.toString());
            scoreLabel_1.setParent(_this.RemoveNode);
            scoreLabel_1.setPosition(pos);
            _this.isStart ? scoreLabel_1.group = "top" : scoreLabel_1.group = "top-guide";
            scoreLabel_1.runAction(cc.sequence(cc.scaleTo(0, 0), cc.scaleTo(.15, 1.5), cc.delayTime(.3), cc.scaleTo(.1, 1), cc.moveTo(.3, targetPos.x, targetPos.y), cc.callFunc(function() {
              _this.showScore = Game_1.Game.getScore();
              GameFactory_1.gFactory.putAddScore(scoreLabel_1);
            })));
          } else {
            var scoreLabel_2 = GameFactory_1.gFactory.getSubScore("/" + Math.abs(score).toString());
            _this.isStart ? scoreLabel_2.group = "top" : scoreLabel_2.group = "top-guide";
            scoreLabel_2.setParent(_this.RemoveNode);
            scoreLabel_2.setPosition(pos);
            scoreLabel_2.runAction(cc.sequence(cc.scaleTo(0, 0), cc.scaleTo(.15, 1.5), cc.delayTime(.3), cc.scaleTo(.1, 1), cc.moveTo(.3, targetPos.x, targetPos.y), cc.callFunc(function() {
              _this.showScore = Game_1.Game.getScore();
              GameFactory_1.gFactory.putSubScore(scoreLabel_2);
            })));
          }
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.UPDATE_CUR_SELECT_POKER, this.updateCurSelectPoker, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.OPEN_RESULT, this.openResult, this);
        this.PokerClip.on(cc.Node.EventType.CHILD_REMOVED, this.onPokerClipRemoveChild, this);
        this.PokerClip.on(cc.Node.EventType.CHILD_ADDED, this.onPokerClipAddChild, this);
        this.SelectPokerNode.on(cc.Node.EventType.CHILD_ADDED, this.onSelectPokerAddChild, this);
        this.SelectPokerNode.on(cc.Node.EventType.CHILD_REMOVED, this.onSelectPokerRemoveChild, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.CHECK_COMPLETE, function(delay) {
          if (0 == _this.PokerClip.childrenCount && 0 == _this.SelectPokerNode.childrenCount) {
            console.error(" openResultTimeDelay:", delay);
            Game_1.Game.getRecyclePoker() <= 0 && setTimeout(function() {
              EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.NO_BUST);
              Game_1.Game.addScore(Pokers_1.NO_BUST_EXTRA_SCORE, CMath.ConvertToNodeSpaceAR(_this.Bust02, Game_1.Game.removeNode));
            }, delay);
            EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.OPEN_RESULT, delay + 1500);
          }
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.BUST, function(index) {
          var bgNode = _this.SpecialBust.getChildByName("bust" + index);
          var pos = CMath.ConvertToNodeSpaceAR(bgNode, _this.RemoveNode);
          var spriteFrame = _this.SpecialAtlas.getSpriteFrame(Pokers_1.SPECIAL_TYPE_NAME[Pokers_1.SPECIAL_TYPE.BUSTED]);
          var node = GameFactory_1.gFactory.getSpecialFont(spriteFrame, cc.v2(pos.x, pos.y + 120), function() {
            bgNode.stopAllActions();
            bgNode.scaleY = 0;
            bgNode.runAction(cc.sequence(cc.fadeIn(0), cc.scaleTo(.1, 1, 1), cc.fadeOut(.2), cc.scaleTo(0, 1, 0)));
          }, true);
          _this.RemoveNode.addChild(node);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.OVER_FIVE_CARDS, function(index) {
          var bgNode = _this.SpecialWild.getChildByName("wild" + index);
          var pos = CMath.ConvertToNodeSpaceAR(bgNode, _this.RemoveNode);
          var spriteFrame = _this.SpecialAtlas.getSpriteFrame(Pokers_1.SPECIAL_TYPE_NAME[Pokers_1.SPECIAL_TYPE.FIVE_CARDS]);
          var scoreBg = _this.SpecialScore.getChildByName("rect" + index).getChildByName("score");
          var node = GameFactory_1.gFactory.getSpecialFont(spriteFrame, cc.v2(pos.x, pos.y + Pokers_1.ADD_SCORE_SPECILA_OFFSET_Y), function() {
            scoreBg.stopAllActions();
            scoreBg.runAction(cc.sequence(cc.moveTo(0, 0, -836), cc.moveTo(Pokers_1.NORMAL_SCORE_MOVE_TIME, 0, 175)));
          });
          _this.RemoveNode.addChild(node);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.COMBO, function(index) {
          var bgNode = _this.SpecialWild.getChildByName("wild" + index);
          var pos = CMath.ConvertToNodeSpaceAR(bgNode, _this.RemoveNode);
          var spriteFrame = _this.SpecialAtlas.getSpriteFrame(Pokers_1.SPECIAL_TYPE_NAME[Pokers_1.SPECIAL_TYPE.COMBO]);
          var scoreBg = _this.SpecialScore.getChildByName("rect" + index).getChildByName("score");
          var node = GameFactory_1.gFactory.getSpecialFont(spriteFrame, cc.v2(pos.x, pos.y + Pokers_1.ADD_SCORE_SPECILA_OFFSET_Y), function() {
            scoreBg.stopAllActions();
            scoreBg.runAction(cc.sequence(cc.moveTo(0, 0, -836), cc.moveTo(Pokers_1.NORMAL_SCORE_MOVE_TIME, 0, 175)));
          });
          _this.RemoveNode.addChild(node);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.SUPER_COMBO, function(index) {
          var bgNode = _this.SpecialWild.getChildByName("wild" + index);
          var pos = CMath.ConvertToNodeSpaceAR(bgNode, _this.RemoveNode);
          var spriteFrame = _this.SpecialAtlas.getSpriteFrame(Pokers_1.SPECIAL_TYPE_NAME[Pokers_1.SPECIAL_TYPE.SUPER_COMBO]);
          var scoreBg = _this.SpecialScore.getChildByName("rect" + index).getChildByName("score");
          var node = GameFactory_1.gFactory.getSpecialFont(spriteFrame, cc.v2(pos.x, pos.y + Pokers_1.ADD_SCORE_SPECILA_OFFSET_Y), function() {
            scoreBg.stopAllActions();
            scoreBg.runAction(cc.sequence(cc.moveTo(0, 0, -836), cc.moveTo(Pokers_1.NORMAL_SCORE_MOVE_TIME, 0, 175)));
          });
          _this.RemoveNode.addChild(node);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.COMPLETE_21, function(index) {
          var bgNode = _this.SpecialWild.getChildByName("wild" + index);
          var pos = CMath.ConvertToNodeSpaceAR(bgNode, _this.RemoveNode);
          var spriteFrame = _this.SpecialAtlas.getSpriteFrame(Pokers_1.SPECIAL_TYPE_NAME[Pokers_1.SPECIAL_TYPE.COMPLETE_21]);
          var scoreBg = _this.SpecialScore.getChildByName("rect" + index).getChildByName("score");
          var node = GameFactory_1.gFactory.getSpecialFont(spriteFrame, cc.v2(pos.x, pos.y + Pokers_1.ADD_SCORE_SPECILA_OFFSET_Y), function() {
            scoreBg.stopAllActions();
            scoreBg.runAction(cc.sequence(cc.moveTo(0, 0, -836), cc.moveTo(Pokers_1.NORMAL_SCORE_MOVE_TIME, 0, 175)));
          });
          _this.RemoveNode.addChild(node);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.NO_BUST, function() {
          var pos = CMath.ConvertToNodeSpaceAR(_this.Bust02, _this.RemoveNode);
          var spriteFrame = _this.SpecialAtlas.getSpriteFrame(Pokers_1.SPECIAL_TYPE_NAME[Pokers_1.SPECIAL_TYPE.NO_BUST]);
          var node = GameFactory_1.gFactory.getSpecialFont(spriteFrame, cc.v2(pos.x, pos.y - 200));
          _this.RemoveNode.addChild(node);
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.WILD, function(index) {
          var bgNode = _this.SpecialWild.getChildByName("wild" + index);
          var pos = CMath.ConvertToNodeSpaceAR(bgNode, _this.RemoveNode);
          var spriteFrame = _this.SpecialAtlas.getSpriteFrame(Pokers_1.SPECIAL_TYPE_NAME[Pokers_1.SPECIAL_TYPE.WILD]);
          var node = GameFactory_1.gFactory.getSpecialFont(spriteFrame, cc.v2(pos.x, pos.y + Pokers_1.ADD_SCORE_SPECILA_OFFSET_Y), function() {
            bgNode.stopAllActions();
            bgNode.scaleY = 0;
            bgNode.runAction(cc.sequence(cc.fadeIn(0), cc.scaleTo(.1, 1, 1), cc.fadeOut(.2), cc.scaleTo(0, 1, 0)));
          });
          _this.RemoveNode.addChild(node);
        }, this);
        cc.loader.loadRes("prefabs/Result");
        cc.loader.loadResDir("sounds");
      };
      GameScene.prototype.onPokerClipRemoveChild = function() {
        this.PokerRestLabel.string = this.PokerClip.childrenCount.toString();
      };
      GameScene.prototype.onPokerClipAddChild = function() {
        this.PokerRestLabel.string = this.PokerClip.childrenCount.toString();
      };
      GameScene.prototype.onSelectPokerAddChild = function(child) {
        if (this.SelectPokerNode.childrenCount > 1) {
          var oldChild = this.SelectPokerNode.children[0];
          var targetPos = cc.v2(0, 0);
          if (this.PokerClip.childrenCount > 0) {
            var child_1 = this.PokerClip.children[this.PokerClip.childrenCount - 1];
            targetPos = cc.v2(child_1.x + 2, child_1.y);
          }
          var pos = CMath.ConvertToNodeSpaceAR(oldChild, this.PokerClip);
          oldChild.setParent(this.PokerClip);
          oldChild.setPosition(pos);
          oldChild.getComponent(Poker_1.default).flipCard(.1);
          oldChild.runAction(cc.moveTo(.1, targetPos));
        }
      };
      GameScene.prototype.onSelectPokerRemoveChild = function(child) {
        console.log(" on Select poker remove child !");
        this.SelectPokerNode.childrenCount <= 0 && this.updateCurSelectPoker();
      };
      GameScene.prototype.updateCurSelectPoker = function() {
        console.log(" poker clip childcount:", this.PokerClip.childrenCount);
        if (this.PokerClip.childrenCount <= 0) return;
        var child = this.PokerClip.children[this.PokerClip.childrenCount - 1];
        var poker = child.getComponent(Poker_1.default);
        var pos = CMath.ConvertToNodeSpaceAR(child, this.SelectPokerNode);
        child.setParent(this.SelectPokerNode);
        child.setPosition(pos);
        poker.isGuide && Game_1.Game.isGameStarted() ? child.group = "top-guide" : child.group = "top";
        poker.flipCard(.1);
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.DEV_POKERS);
        var action = cc.sequence(cc.moveTo(.3, 0, 0), cc.callFunc(function() {
          poker.setDefaultPosition();
          poker.isGuide || (child.group = "default");
        }, this));
        action.setTag(Pokers_1.ACTION_TAG.SELECT_POKER);
        child.stopAllActions();
        child.runAction(action);
      };
      GameScene.prototype.openResult = function(delay) {
        var _this = this;
        this.Stop.hide();
        if (this.node.getChildByName("Result")) return;
        if (!this.isStart) {
          this.Guide.hide();
          this.nextStep(LOAD_STEP.GUIDE);
          return;
        }
        Game_1.Game.getGameTime() > 0 ? Game_1.Game.isBoom() ? this.CompleteSprite.spriteFrame = this.CompleteAtlas.getSpriteFrame("bg_font3") : this.CompleteSprite.spriteFrame = this.CompleteAtlas.getSpriteFrame("bg_font1") : Game_1.Game.isBoom() ? this.CompleteSprite.spriteFrame = this.CompleteAtlas.getSpriteFrame("bg_font3") : this.CompleteSprite.spriteFrame = this.CompleteAtlas.getSpriteFrame("bg_font2");
        this.CompleteSprite.node.scaleX = 0;
        this.CompleteSprite.node.active = true;
        cc.loader.loadRes("prefabs/Result", cc.Prefab, function(err, result) {
          err ? celerx.submitScore(Game_1.Game.getScore()) : _this.CompleteSprite.node.runAction(cc.sequence(cc.scaleTo(.2, 1.2, 1), cc.scaleTo(.1, .9, 1), cc.scaleTo(.1, 1.1, 1), cc.scaleTo(.1, 1, 1), cc.delayTime(.5 + delay / 1e3), cc.callFunc(function() {
            _this.CompleteSprite.node.active = false;
            var resultLayer = cc.instantiate(result);
            resultLayer.name = "Result";
            _this.node.addChild(resultLayer);
          })));
        });
      };
      GameScene.prototype.celerStart = function() {
        var match = celerx.getMatch();
        if (match && match.sharedRandomSeed) {
          CMath.randomSeed = match.sharedRandomSeed;
          CMath.sharedSeed = match.sharedRandomSeed;
        } else CMath.randomSeed = Math.random();
        if (match && match.shouldLaunchTutorial || true) this.isNewPlayer = true; else {
          this.isNewPlayer = false;
          this.Guide.hide();
          this.nextStep(LOAD_STEP.GUIDE);
        }
        var takeImage = false;
        var canvas = document.getElementsByTagName("canvas")[0];
        cc.director.on(cc.Director.EVENT_AFTER_DRAW, function() {
          if (takeImage) {
            takeImage = false;
            celerx.didTakeSnapshot(canvas.toDataURL("image/jpeg", .1));
          }
        });
        celerx.provideCurrentFrameData(function() {
          takeImage = true;
        });
        this.nextStep(LOAD_STEP.CELER);
      };
      GameScene.prototype.nextStep = function(loadStep) {
        this.step |= loadStep;
        console.log("loadStep Step:" + LOAD_STEP[loadStep]);
        if (this.step >= LOAD_STEP.DONE && !this.isStart) {
          console.log("  startGame ---------------------- ");
          this.isStart = true;
          this.startGame();
        } else if (this.step >= LOAD_STEP.CELER_READY && !this.isCeler) {
          celerx.ready();
          this.isCeler = true;
          true, this.celerStart();
        } else if (this.step >= LOAD_STEP.GUIDE_READY && this.isNewPlayer && !this.guideDone) {
          this.guideDone = true;
          this.startGuide();
        }
      };
      GameScene.prototype.prepareGame = function() {
        for (var _i = 0, _a = Game_1.Game.allPokers; _i < _a.length; _i++) {
          var poker = _a[_i];
          poker.stopAllActions();
          poker.rotation = 0;
          GameFactory_1.gFactory.putPoker(poker);
        }
        Game_1.Game.allPokers.length = 0;
        this.showScore = 0;
        this.TimeAnimation.node.active = false;
        this.TimeLabel.font = this.SmallWhite;
        this.TimeIcon.spriteFrame = this.TimeIconAtlas.getSpriteFrame("icon_time");
        var gameTime = Game_1.Game.getGameTime();
        this.TimeLabel.string = CMath.TimeFormat(gameTime);
        Game_1.Game.getCycledPokerRoot().clear();
        Game_1.Game.getPlacePokerRoot().clear();
        for (var _b = 0, _c = this.PlaceRoot.children; _b < _c.length; _b++) {
          var child = _c[_b];
          child.getComponent(cc.Sprite) && child.getComponent(cc.Sprite).enabled && (child.getComponent(cc.Sprite).enabled = true);
          Game_1.Game.addPlacePokerRoot(parseInt(child.name), child);
        }
      };
      GameScene.prototype.startGuide = function() {
        var _this = this;
        var pokers = Pokers_1.GuidePokers.concat();
        Game_1.Game.allPokers.length = 0;
        while (pokers.length > 0) {
          var curIndex = pokers.length - 1;
          var pokerNode = GameFactory_1.gFactory.getPoker([ pokers.pop(), true ]);
          pokerNode.name = curIndex.toString();
          pokerNode.x = 0;
          pokerNode.y = 0;
          this.PokerDevl.addChild(pokerNode);
          Game_1.Game.allPokers.push(pokerNode);
        }
        this.Guide.showBlock();
        this.startDevPoker(function() {
          _this.registerGuide();
          _this.Guide.startGuide(function() {
            _this.nextStep(LOAD_STEP.GUIDE);
          });
        }, 0);
      };
      GameScene.prototype.startDevPoker = function(callback, delay) {
        var _this = this;
        void 0 === delay && (delay = .05);
        var count = 1;
        var totalCount = this.PokerDevl.childrenCount;
        var func2 = function() {
          var pokerNode = _this.PokerDevl.getChildByName((totalCount - count++).toString());
          if (!pokerNode) {
            _this.canDispatchPoker = true;
            _this.updateCurSelectPoker();
            callback();
            return;
          }
          var targetPos = cc.v2(2 * _this.PokerClip.childrenCount, 0);
          var selfPos = CMath.ConvertToNodeSpaceAR(pokerNode, _this.PokerClip);
          var poker_1 = pokerNode.getComponent(Poker_1.default);
          poker_1.setLastPosition(targetPos);
          pokerNode.setParent(_this.PokerClip);
          pokerNode.zIndex = _this.PokerClip.childrenCount;
          if (delay > 0) {
            pokerNode.setPosition(selfPos);
            pokerNode.group = "top";
            EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.DEV_POKERS);
            pokerNode.runAction(cc.sequence(cc.moveTo(delay, targetPos.x, targetPos.y), cc.callFunc(function() {
              pokerNode.group = "default";
              poker_1.setLastPosition();
              func2();
            }, _this)));
          } else {
            pokerNode.setPosition(targetPos);
            func2();
          }
        };
        func2();
      };
      GameScene.prototype.startGame = function() {
        Game_1.Game.initData();
        this.prepareGame();
        var pokers = Pokers_1.Pokers.concat([]).reverse();
        console.log(pokers);
        console.log(pokers.length);
        while (pokers.length > 0) {
          var curIndex = pokers.length - 1;
          var totalWeight = pokers.length;
          var random = CMath.getRandom(0, 1);
          var randomIndex = Math.floor(random * totalWeight);
          var i = pokers.splice(randomIndex, 1);
          console.warn("randomIndex:", randomIndex, ", poker:", i, ",random:", random);
          var pokerNode = GameFactory_1.gFactory.getPoker(i);
          pokerNode.name = curIndex.toString();
          pokerNode.x = 0;
          pokerNode.y = 0;
          this.PokerDevl.addChild(pokerNode);
        }
        this.startDevPoker(function() {});
      };
      GameScene.prototype.recyclePoker = function() {};
      GameScene.prototype.devPoker = function() {};
      GameScene.prototype.dispatchPoker = function() {
        var _this = this;
        return;
        var nodes;
        var parents;
        var poses;
        var funcs;
      };
      GameScene.prototype.update = function(dt) {
        this.devTime += dt;
        this.backTime += dt;
        if (Game_1.Game.isGameStarted()) {
          Game_1.Game.addGameTime(-dt);
          var gameTime = Game_1.Game.getGameTime();
          this.TimeLabel.string = CMath.TimeFormat(gameTime);
          if (gameTime <= 60) {
            this.TimeLabel.font = this.SmallOrg;
            if (!this.TimeAnimation.node.active) {
              EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PLAY_SHAKE);
              this.TimeAnimation.node.active = true;
              this.TimeAnimation.play();
              this.TimeIcon.spriteFrame = this.TimeIconAtlas.getSpriteFrame("icon_time_2");
            }
          }
        }
        if (this.score < this.showScore) {
          this.score += this.scoreStep;
          this.score = Math.min(this.score, this.showScore);
          this.ScoreLabel.string = this.score.toString();
        } else if (this.score > this.showScore) {
          this.score -= this.scoreStep;
          this.score = Math.max(this.score, this.showScore);
          this.ScoreLabel.string = this.score.toString();
        }
      };
      __decorate([ property(cc.Prefab) ], GameScene.prototype, "Poker", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "Top", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "PlaceBack", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "TouchRoot", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "ValueRootNode", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "PokerClip", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "PlaceRoot", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "PokerDevl", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "RemoveNode", void 0);
      __decorate([ property(cc.Button) ], GameScene.prototype, "BackButton", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "Bust01", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "Bust02", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "Bust03", void 0);
      __decorate([ property(cc.Button) ], GameScene.prototype, "PauseButton", void 0);
      __decorate([ property(cc.SpriteAtlas) ], GameScene.prototype, "BackButtonAtlas", void 0);
      __decorate([ property(cc.Label) ], GameScene.prototype, "TimeLabel", void 0);
      __decorate([ property(cc.Sprite) ], GameScene.prototype, "TimeIcon", void 0);
      __decorate([ property(cc.SpriteAtlas) ], GameScene.prototype, "TimeIconAtlas", void 0);
      __decorate([ property(cc.Label) ], GameScene.prototype, "ScoreLabel", void 0);
      __decorate([ property(cc.Font) ], GameScene.prototype, "SmallOrg", void 0);
      __decorate([ property(cc.Font) ], GameScene.prototype, "SmallWhite", void 0);
      __decorate([ property(cc.Prefab) ], GameScene.prototype, "SubScoreLabel", void 0);
      __decorate([ property(cc.Prefab) ], GameScene.prototype, "AddScoreLabel", void 0);
      __decorate([ property(cc.Prefab) ], GameScene.prototype, "SpecialFont", void 0);
      __decorate([ property(cc.Animation) ], GameScene.prototype, "TimeAnimation", void 0);
      __decorate([ property(Stop_1.default) ], GameScene.prototype, "Stop", void 0);
      __decorate([ property(Guide_1.default) ], GameScene.prototype, "Guide", void 0);
      __decorate([ property(cc.Animation) ], GameScene.prototype, "Complete", void 0);
      __decorate([ property(cc.Button) ], GameScene.prototype, "SubmitButton", void 0);
      __decorate([ property(cc.Toggle) ], GameScene.prototype, "CheatToggle", void 0);
      __decorate([ property(cc.Label) ], GameScene.prototype, "PokerRestLabel", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "SelectPokerNode", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "SpecialWild", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "SpecialBust", void 0);
      __decorate([ property(cc.SpriteAtlas) ], GameScene.prototype, "SpecialAtlas", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "SpecialScore", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "RemoveCardNode", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "RemoveBustNode", void 0);
      __decorate([ property(cc.SpriteAtlas) ], GameScene.prototype, "WildBtn", void 0);
      __decorate([ property(cc.Label) ], GameScene.prototype, "WildCount", void 0);
      __decorate([ property(cc.SpriteAtlas) ], GameScene.prototype, "CompleteAtlas", void 0);
      __decorate([ property(cc.Sprite) ], GameScene.prototype, "CompleteSprite", void 0);
      __decorate([ property(cc.Sprite) ], GameScene.prototype, "combo1", void 0);
      __decorate([ property(cc.Sprite) ], GameScene.prototype, "combo2", void 0);
      __decorate([ property(cc.Animation) ], GameScene.prototype, "AddWildEffect", void 0);
      GameScene = __decorate([ ccclass ], GameScene);
      return GameScene;
    }(cc.Component);
    exports.default = GameScene;
    cc._RF.pop();
  }, {
    "./Guide": "Guide",
    "./Poker": "Poker",
    "./Pokers": "Pokers",
    "./Stop": "Stop",
    "./controller/AudioController": "AudioController",
    "./controller/EventManager": "EventManager",
    "./controller/EventName": "EventName",
    "./controller/Game": "Game",
    "./controller/GameFactory": "GameFactory",
    "./utils/celerx": "celerx"
  } ],
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "40425qmjHtE2rUaEpFgHzOS", "Game");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var HashMap_1 = require("../utils/HashMap");
    var Poker_1 = require("../Poker");
    var Pokers_1 = require("../Pokers");
    var EventManager_1 = require("./EventManager");
    var EventName_1 = require("./EventName");
    var GameMgr = function() {
      function GameMgr() {
        this.placePokerRoot = new HashMap_1.HashMap();
        this.cyclePokerRoot = new HashMap_1.HashMap();
        this.posOffsetCal = new HashMap_1.HashMap();
        this.stepInfoArray = [];
        this.score = 0;
        this.timeBonus = 0;
        this.freeDrawTimes = 3;
        this.flipCounts = 0;
        this.pokerClip = null;
        this.curSelectNode = null;
        this.wildCount = 1;
        this.gameStart = false;
        this.gameTime = 180;
        this.removePokerCount = 0;
        this.recycleCount = 0;
        this.pokerFlipRoot = null;
        this.combo = -1;
        this.totalStreak = 0;
        this.streakCount = 0;
        this.clearStack = 0;
        this.cardUsed = 0;
        this.busted = 0;
        this.recyclePoker = 0;
        this.allPokers = [];
      }
      GameMgr.prototype.GameMgr = function() {};
      Object.defineProperty(GameMgr, "inst", {
        get: function() {
          return this._inst ? this._inst : this._inst = new GameMgr();
        },
        enumerable: true,
        configurable: true
      });
      GameMgr.prototype.initData = function() {
        this.gameTime = 180;
        this.gameStart = false;
        this.wildCount = 1;
        this.removePokerCount = 0;
        this.recycleCount = 0;
        this.combo = -1;
        this.totalStreak = 0;
        this.streakCount = 0;
        this.clearStack = 0;
        this.cardUsed = 0;
        this.busted = 0;
        this.recyclePoker = 0;
        this.stepInfoArray.length = 0;
        this.timeBonus = 0;
        this.flipCounts = 0;
        this.score = 0;
        this.freeDrawTimes = 3;
      };
      GameMgr.prototype.addRecyclePoker = function(count) {
        this.recyclePoker += count;
        this.recyclePoker = Math.max(0, this.recyclePoker);
        console.error(" recycle bust fuck:", this.recyclePoker);
        if (this.recyclePoker >= Pokers_1.BOOOOM_LIMIT && !window["CheatOpen"]) {
          console.error(" recycle poker error!!!!");
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.OPEN_RESULT, 1e3);
        }
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_RECYCLE_POKER, this.recyclePoker);
      };
      GameMgr.prototype.getRecyclePoker = function() {
        return this.recyclePoker;
      };
      GameMgr.prototype.getCurSelectPoker = function() {
        return this.curSelectNode.children[0] ? this.curSelectNode.children[0].getComponent(Poker_1.default) : null;
      };
      GameMgr.prototype.addPosOffset = function(key, offset) {
        var pos = this.posOffsetCal.get(key);
        if (pos) {
          var off = Math.max(0, pos + offset);
          this.posOffsetCal.add(key, pos + offset);
        } else this.posOffsetCal.add(key, offset);
        for (var i = 0; i < 8; i++) console.log(" --------addPosOffset key:", i, ":", this.getPosOffset(i));
      };
      GameMgr.prototype.getPosOffset = function(key) {
        var pos = this.posOffsetCal.get(key);
        return null == pos ? 0 : pos;
      };
      GameMgr.prototype.addWildCount = function(wild) {
        this.wildCount += wild;
        this.wildCount = Math.max(0, this.wildCount);
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_WILD_COUNT, wild);
      };
      GameMgr.prototype.getWildCount = function() {
        return this.wildCount;
      };
      GameMgr.prototype.getCombo = function() {
        return this.combo;
      };
      GameMgr.prototype.resetCombo = function() {
        this.combo = -1;
      };
      GameMgr.prototype.addCombo = function(combo) {
        this.combo += combo;
        this.combo = Math.max(0, this.combo % 13);
        console.log(" combo:", this.combo);
      };
      GameMgr.prototype.addCardUsed = function(used) {
        this.cardUsed += used;
      };
      GameMgr.prototype.getCardUsed = function() {
        return this.cardUsed;
      };
      GameMgr.prototype.addBusted = function(bust) {
        this.busted += bust;
      };
      GameMgr.prototype.getBusted = function() {
        return this.busted;
      };
      GameMgr.prototype.addClearStack = function(stack) {
        this.clearStack += stack;
      };
      GameMgr.prototype.getClearStack = function() {
        return this.clearStack;
      };
      GameMgr.prototype.addStreak = function(streak) {
        this.streakCount += streak;
        this.totalStreak += streak;
        this.streakCount >= 3 && exports.Game.addWildCount(1);
        this.streakCount = Math.min(this.streakCount, 3);
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_STREAK_COUNT);
        console.error(" add streak !!!!!!!!!!!!!!!!!! ,", this.streakCount);
      };
      GameMgr.prototype.getTotalStreak = function() {
        return Math.max(0, this.totalStreak - 1);
      };
      GameMgr.prototype.getStreak = function() {
        return this.streakCount;
      };
      GameMgr.prototype.clearStreak = function() {
        this.streakCount = 0;
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_STREAK_COUNT);
        console.error(" clearStreak streak !!!!!!!!!!!!!!!!!! ,", this.streakCount);
      };
      GameMgr.prototype.getGameTime = function() {
        return this.gameTime;
      };
      GameMgr.prototype.addRecycleCount = function(count) {
        this.recycleCount += count;
        console.log(" ---------------------recycle count :", this.recycleCount);
        if (this.recycleCount > 78 || this.recycleCount < 0) {
          console.error(" recycle count error! ", this.recycleCount);
          this.recycleCount = CMath.Clamp(this.recycleCount, 78, 0);
        }
      };
      GameMgr.prototype.addGameTime = function(time) {
        if (window["noTime"] || exports.Game.isComplete()) return;
        this.gameTime += time;
        this.gameTime = Math.max(this.gameTime, 0);
        if (this.gameTime <= 0) {
          this.gameStart = false;
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.OPEN_RESULT, 0);
        }
      };
      GameMgr.prototype.calTimeBonus = function() {
        this.removePokerCount = this.removeCardNode.childrenCount;
        if (this.gameTime >= 300 || this.gameTime <= 0 || this.removePokerCount <= 0) return;
        this.timeBonus = (this.removePokerCount / Pokers_1.TOTAL_POKER_COUNT * 2.4 + .3) * this.gameTime;
        this.timeBonus = Math.floor(this.timeBonus);
        console.error("this.flipCounts: ", this.flipCounts, ", this.gameTime:", this.gameTime, ",this.timbonus:", this.timeBonus);
        exports.Game.addScore(this.timeBonus);
      };
      GameMgr.prototype.getTimeBonus = function() {
        return this.timeBonus;
      };
      GameMgr.prototype.isTimeOver = function() {
        return this.gameTime <= 0;
      };
      GameMgr.prototype.start = function() {
        this.gameStart = true;
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PLAY_START);
      };
      GameMgr.prototype.isComplete = function() {
        return this.flipCounts >= Pokers_1.TOTAL_POKER_COUNT;
      };
      GameMgr.prototype.isBoom = function() {
        return this.recyclePoker >= Pokers_1.BOOOOM_LIMIT;
      };
      GameMgr.prototype.checkIsRecycleComplete = function() {
        var isComplete = 78 == this.recycleCount;
        if (isComplete) {
          console.log(" isComplete isComplete ");
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.AUTO_COMPLETE_DONE);
        }
        return isComplete;
      };
      GameMgr.prototype.restart = function() {
        this.gameTime = 300;
        this.score = 0;
        this.flipCounts = 0;
        this.stepInfoArray = [];
        this.timeBonus = 0;
        this.cyclePokerRoot.clear();
        this.placePokerRoot.clear();
        this.gameStart = false;
        this.removePokerCount = 0;
      };
      GameMgr.prototype.addRemovePokerCount = function(count) {
        this.removePokerCount = exports.Game.removeCardNode.childrenCount;
        if (this.removePokerCount + exports.Game.removeBustedNode.childrenCount == Pokers_1.TOTAL_POKER_COUNT) {
          console.error(" ---------------- addRemovePokerCount ------openResultTimeDelay-----------------");
          this.calTimeBonus();
        }
      };
      GameMgr.prototype.setPause = function(pause) {
        this.gameStart = !pause;
      };
      GameMgr.prototype.isGameStarted = function() {
        return this.gameStart;
      };
      GameMgr.prototype.addScore = function(score, pos) {
        void 0 === pos && (pos = cc.v2(-200, 700));
        if (0 == score) return;
        score = Math.floor(score);
        this.score += score;
        this.score = Math.max(this.score, 0);
        console.error("----------- game addScore-------- score:", this.score, score);
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_SCORE, score, pos);
      };
      GameMgr.prototype.getScore = function() {
        return this.score;
      };
      GameMgr.prototype.addFreeDrawTimes = function(times) {
        this.freeDrawTimes += times;
        this.freeDrawTimes = Math.max(this.freeDrawTimes, 0);
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_DRAW_ICON);
      };
      GameMgr.prototype.getFreeDrawTimes = function() {
        return this.freeDrawTimes;
      };
      GameMgr.prototype.addFlipCounts = function(count) {
        if (!this.isGameStarted()) return;
        this.flipCounts += count;
        this.flipCounts = Math.max(this.flipCounts, 0);
        console.error("-----------------------------------flipCounts:", this.flipCounts);
        this.isComplete() && console.error("-------------emit Complete!!!----------------------flipCounts:", this.flipCounts);
      };
      GameMgr.prototype.getFlipCounts = function() {
        return this.flipCounts;
      };
      GameMgr.prototype.addStep = function(node, lastParent, lastPos, func, scores, scorePos, zIndex) {
        this.stepInfoArray.length = 0;
        this.stepInfoArray.push({
          node: node,
          lastParent: lastParent,
          lastPos: lastPos,
          func: func,
          datas: scores,
          scoresPos: scorePos,
          zIndex: zIndex
        });
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_BACK_BTN_ICON);
      };
      GameMgr.prototype.getTopStep = function() {
        if (this.stepInfoArray.length <= 0) return null;
        return this.stepInfoArray[this.stepInfoArray.length - 1];
      };
      GameMgr.prototype.getPlacePokerRoot = function() {
        return this.placePokerRoot;
      };
      GameMgr.prototype.getCycledPokerRoot = function() {
        return this.cyclePokerRoot;
      };
      GameMgr.prototype.addPlacePokerRoot = function(key, node) {
        if (this.isComplete()) return;
        this.placePokerRoot.add(key, node);
        this.placePokerRoot.length > 8 && console.error(" place Poker Root over size!!!!!:", this.placePokerRoot.length);
      };
      GameMgr.prototype.addCycledPokerRoot = function(key, node) {
        this.cyclePokerRoot.add(key, node);
        this.cyclePokerRoot.length > 4 && console.error(" cycled Poker root over size!!!!!:", this.cyclePokerRoot.length);
      };
      GameMgr.prototype.clearStep = function() {
        this.stepInfoArray.length = 0;
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_BACK_BTN_ICON);
      };
      GameMgr.prototype.backStep = function() {
        if (this.stepInfoArray.length <= 0) {
          console.warn(" no cache step!");
          return false;
        }
        exports.Game.clearStreak();
        exports.Game.resetCombo();
        var step = this.stepInfoArray.pop();
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_BACK_BTN_ICON);
        var count = 0;
        var _loop_1 = function() {
          count++;
          var node = step.node.pop();
          var parent = step.lastParent.pop();
          var pos = step.lastPos.pop();
          var func = step.func ? step.func.pop() : null;
          var datas = step.datas && step.datas.length > 0 ? step.datas.pop() : null;
          var score = datas ? datas.score : 0;
          if (datas) {
            exports.Game.addBusted(datas.busted);
            exports.Game.addCardUsed(datas.cardused);
            exports.Game.addClearStack(datas.stack);
            exports.Game.totalStreak += datas.streak;
          }
          var scorePos = step.scoresPos && step.scoresPos.length > 0 ? step.scoresPos.pop() : null;
          scorePos ? exports.Game.addScore(score, scorePos) : exports.Game.addScore(score);
          var selfPos = CMath.ConvertToNodeSpaceAR(node, parent);
          node.setPosition(selfPos);
          if (func && func.callback && func.target) {
            console.log("call func !");
            func.callback.apply(func.target, func.args);
          }
          node.group = "top";
          var poker = node.getComponent(Poker_1.default);
          if (poker) {
            var returnPos = void 0;
            if ("PokerClip" == parent.name) returnPos = poker.getLastPosition(); else {
              returnPos = "PokerFlipRoot" == parent.name ? poker.getFlipPos() : poker.getDefaultPosition();
              if (parent.getComponent(Poker_1.default)) if (parent.getComponent(Poker_1.default).isCycled()) {
                returnPos.x = 0;
                returnPos.y = 0;
              } else func && func.callback && func.callback == parent.getComponent(Poker_1.default).flipCard ? returnPos.y = Pokers_1.OFFSET_Y / 3 : returnPos.y = Pokers_1.OFFSET_Y; else if ("place_aback" == parent.name) {
                returnPos.x = 0;
                returnPos.y = 0;
              }
            }
            poker.setDefaultPosition(cc.v2(returnPos.x, returnPos.y));
            poker.setPosState(Poker_1.POS_STATE.NORMAL, false);
            node.setParent(parent);
            console.error(" fuck:", parent.name);
            var action = cc.sequence(cc.delayTime(count / 500), cc.callFunc(function() {
              EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.DEV_POKERS);
              poker.node.stopActionByTag(Pokers_1.ACTION_TAG.FLIP_CARD_REPOS_ON_REMOVE);
              poker.node.stopActionByTag(Pokers_1.ACTION_TAG.FLIP_CARD_REPOS_ON_ADD);
              poker.node.stopActionByTag(Pokers_1.ACTION_TAG.SHAKE);
            }, this_1), cc.moveTo(.1, returnPos.x, returnPos.y), cc.callFunc(function() {
              node.group = "default";
              poker.setDefaultPosition();
              parent.getComponent(Poker_1.default) && poker.checkPos();
            }, this_1));
            action.setTag(Pokers_1.ACTION_TAG.BACK_STEP);
            poker.node.stopAllActions();
            0 != poker.node.rotation && poker.node.runAction(cc.rotateTo(.1, 0));
            poker.node.runAction(action);
          }
        };
        var this_1 = this;
        while (step.node.length > 0) _loop_1();
        return count > 0;
      };
      GameMgr.prototype.canBackStep = function() {
        return this.stepInfoArray.length > 0;
      };
      return GameMgr;
    }();
    exports.Game = GameMgr.inst;
    cc._RF.pop();
  }, {
    "../Poker": "Poker",
    "../Pokers": "Pokers",
    "../utils/HashMap": "HashMap",
    "./EventManager": "EventManager",
    "./EventName": "EventName"
  } ],
  Guide: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b35055BqMpN/5j/PIM39A+p", "Guide");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventManager_1 = require("./controller/EventManager");
    var EventName_1 = require("./controller/EventName");
    var Poker_1 = require("./Poker");
    var Game_1 = require("./controller/Game");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Guide = function(_super) {
      __extends(Guide, _super);
      function Guide() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.GuideAtlas = null;
        _this.GuideHand = null;
        _this.GuideEnd = null;
        _this.Corn = null;
        _this.ButtonAtlas = null;
        _this.Next = null;
        _this.OK = null;
        _this.Forward = null;
        _this.GuideView = null;
        _this.Skip = null;
        _this.Block = null;
        _this.GuideBlock = null;
        _this.callback = null;
        _this.guideSteps = [];
        _this.isGuide = false;
        _this.index = 1;
        _this.guideDefaultY = 0;
        return _this;
      }
      Guide.prototype.onLoad = function() {
        var _this = this;
        this.Corn.spriteFrame = this.GuideAtlas.getSpriteFrame("new1");
        this.Corn.node.position = cc.v2(252, -48);
        this.guideDefaultY = this.Corn.node.y;
        this.GuideHand.node.active = false;
        this.Next.node.on(cc.Node.EventType.TOUCH_END, this.nextPage, this);
        this.Forward.node.on(cc.Node.EventType.TOUCH_END, this.forwardPage, this);
        this.Skip.node.on(cc.Node.EventType.TOUCH_END, function() {
          _this.hide();
        }, this);
        this.OK.node.on(cc.Node.EventType.TOUCH_END, function() {
          _this.nextGuide();
          _this.OK.node.active = false;
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.POP_GUIDE_STEP, function() {
          if (_this.guideSteps.length <= 0 || !_this.node.active) return;
          _this.popStep();
          _this.nextGuide();
        }, this);
        this.Block.on(cc.Node.EventType.TOUCH_START, this.onBlockTouch, this);
        this.Block.on(cc.Node.EventType.TOUCH_CANCEL, this.onBlockTouchCancel, this);
        this.Block.on(cc.Node.EventType.TOUCH_END, this.onBlockTouchEnd, this);
        this.Block.on(cc.Node.EventType.TOUCH_MOVE, this.onBlockTouchMove, this);
      };
      Guide.prototype.onBlockTouch = function(e) {
        if (this.guideSteps.length <= 0) return;
        if (this.OK.node.active) return;
        var curStep = this.guideSteps[0];
        for (var _i = 0, _a = curStep.touches; _i < _a.length; _i++) {
          var touch = _a[_i];
          var exceptChild = null;
          if (null == touch.node) {
            if (!touch.nodeFunc) continue;
            touch.node = touch.nodeFunc();
          }
          touch.node && touch.node.getComponent(Poker_1.default) && touch.node.getComponent(Poker_1.default).getNext() && (exceptChild = touch.node.getComponent(Poker_1.default).getNext().node);
          if (CMath.GetBoxToWorld(touch.node, exceptChild).contains(e.getLocation())) {
            var event = new cc.Event.EventCustom(e.getType(), false);
            event.setUserData(touch.callback);
            touch.node.dispatchEvent(event);
            touch.touchStarted = true;
          }
        }
      };
      Guide.prototype.onBlockTouchCancel = function(e) {
        if (this.guideSteps.length <= 0) return;
        if (this.OK.node.active) return;
        var curStep = this.guideSteps[0];
        for (var _i = 0, _a = curStep.touches; _i < _a.length; _i++) {
          var touch = _a[_i];
          var exceptChild = null;
          touch.node && touch.node.getComponent(Poker_1.default) && touch.node.getComponent(Poker_1.default).getNext() && (exceptChild = touch.node.getComponent(Poker_1.default).getNext().node);
          if (CMath.GetBoxToWorld(touch.node, exceptChild).contains(e.getLocation()) && touch.touchStarted) {
            var event = new cc.Event.EventCustom(e.getType(), false);
            event.setUserData(touch.callback);
            touch.node.dispatchEvent(event);
            touch.touchStarted = false;
          }
        }
      };
      Guide.prototype.onBlockTouchEnd = function(e) {
        if (this.guideSteps.length <= 0) return;
        if (this.OK.node.active) return;
        var curStep = this.guideSteps[0];
        for (var _i = 0, _a = curStep.touches; _i < _a.length; _i++) {
          var touch = _a[_i];
          var exceptChild = null;
          touch.node && touch.node.getComponent(Poker_1.default) && touch.node.getComponent(Poker_1.default).getNext() && (exceptChild = touch.node.getComponent(Poker_1.default).getNext().node);
          if (CMath.GetBoxToWorld(touch.node, exceptChild).contains(e.getLocation()) && touch.touchStarted) {
            var event = new cc.Event.EventCustom(e.getType(), false);
            event.setUserData(touch.callback);
            touch.node.dispatchEvent(event);
            touch.touchStarted = false;
          }
        }
      };
      Guide.prototype.popStep = function() {
        if (this.guideSteps.length <= 0) return;
        console.log(" pop guide step---------------------------------------------------");
        var curStep = this.guideSteps.shift();
        for (var _i = 0, _a = curStep.touches; _i < _a.length; _i++) {
          var touch = _a[_i];
          touch.end && touch.end && touch.end();
        }
      };
      Guide.prototype.clearStep = function() {
        if (this.guideSteps.length <= 0) return;
        for (var _i = 0, _a = this.guideSteps; _i < _a.length; _i++) {
          var curStep = _a[_i];
          for (var _b = 0, _c = curStep.touches; _b < _c.length; _b++) {
            var touch = _c[_b];
            touch.end && touch.end && touch.end();
          }
        }
      };
      Guide.prototype.showEnd = function() {
        var _this = this;
        console.log(" show end ");
        this.Corn.node.active = true;
        this.Corn.node.position = cc.v2(0, 100);
        this.Corn.spriteFrame = this.GuideEnd;
        this.OK.node.active = true;
        this.OK.node.targetOff(this);
        this.OK.node.on(cc.Node.EventType.TOUCH_END, function() {
          _this.hide();
        }, this);
        this.GuideHand.node.active = false;
        Game_1.Game.getCurSelectPoker() && (Game_1.Game.getCurSelectPoker().node.group = "default");
      };
      Guide.prototype.onBlockTouchMove = function(e) {
        if (this.guideSteps.length <= 0) return;
        if (this.OK.node.active) return;
        var curStep = this.guideSteps[0];
        for (var _i = 0, _a = curStep.touches; _i < _a.length; _i++) {
          var touch = _a[_i];
          if (touch.isButton || !touch.touchStarted || !touch.node) continue;
          e.bubbles = false;
          touch.node.dispatchEvent(e);
        }
      };
      Guide.prototype.register = function(steps) {
        this.guideSteps = steps;
      };
      Guide.prototype.startGuide = function(closeCallback) {
        this.OK.node.active = false;
        this.isGuide = true;
        this.node.active = true;
        this.Next.node.active = false;
        this.Forward.node.active = false;
        this.GuideView.node.active = false;
        this.GuideBlock.active = false;
        this.Skip.node.active = true;
        this.callback = closeCallback;
        this.nextGuide();
      };
      Guide.prototype.nextGuide = function() {
        var count = this.guideSteps.length;
        if (count <= 0) {
          this.showEnd();
          return;
        }
        6 == this.index && (this.Corn.node.position = cc.v2(227, -295));
        7 == this.index && (this.Corn.node.position = cc.v2(227, 0));
        this.Corn.spriteFrame = this.GuideAtlas.getSpriteFrame("new" + this.index);
        this.index++;
        var curStep = this.guideSteps[0];
        var actions = [];
        var speed = 550;
        var touchActions = [];
        for (var _i = 0, _a = curStep.touches; _i < _a.length; _i++) {
          var touch = _a[_i];
          !touch.node && touch.nodeFunc && (touch.node = touch.nodeFunc());
          touch.isAction && touch.node && touchActions.push(touch.node);
        }
        if (touchActions.length > 0) {
          var pos = void 0;
          pos = curStep.touches.length > 1 ? CMath.ConvertToNodeSpaceAR(touchActions[1], this.GuideHand.node.parent) : CMath.ConvertToNodeSpaceAR(touchActions[0], this.GuideHand.node.parent);
          this.GuideHand.node.position = pos;
        }
        for (var _b = 0, _c = curStep.touches; _b < _c.length; _b++) {
          var touch = _c[_b];
          touch.node.group = "guide";
          touch.start && touch.start();
          if (touch.isAction) {
            var pos = CMath.ConvertToNodeSpaceAR(touch.node, this.GuideHand.node.parent);
            this.GuideHand.node.active = true;
            this.GuideHand.node.position = pos;
            this.GuideHand.node.opacity = 255;
          }
        }
      };
      Guide.prototype.hide = function() {
        console.error(" hide ");
        if (!this.node.active) return;
        this.clearStep();
        this.node.active = false;
        this.callback && this.callback();
        this.callback = null;
      };
      Guide.prototype.showBlock = function() {
        this.Block.active = true;
        this.Corn.node.active = true;
        this.OK.node.active = false;
        this.Skip.node.active = false;
        this.node.active = true;
      };
      Guide.prototype.show = function(closeCallback) {
        this.OK.node.active = false;
        this.Corn.node.active = false;
        this.GuideHand.node.active = false;
        this.isGuide = false;
        this.Next.node.active = true;
        this.GuideView.node.active = true;
        this.Skip.node.active = false;
        this.Next.node.active = true;
        this.Forward.node.active = true;
        this.GuideBlock.active = true;
        this.node.active = true;
        this.callback = closeCallback;
        this.GuideView.scrollToPage(0, 0);
        this.Forward.node.active = false;
        this.Next.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.ButtonAtlas.getSpriteFrame("btn_new");
      };
      Guide.prototype.nextPage = function() {
        if (this.GuideView.getCurrentPageIndex() >= this.GuideView.content.childrenCount - 1) this.hide(); else {
          var nextPageIndex = (this.GuideView.getCurrentPageIndex() + 1) % this.GuideView.content.childrenCount;
          this.GuideView.setCurrentPageIndex(nextPageIndex);
          nextPageIndex >= this.GuideView.content.childrenCount - 1 && (this.Next.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.ButtonAtlas.getSpriteFrame("new_close"));
          this.Forward.node.active = 0 != nextPageIndex;
        }
      };
      Guide.prototype.forwardPage = function() {
        if (this.GuideView.getCurrentPageIndex() <= 0) ; else {
          var nextPageIndex = (this.GuideView.getCurrentPageIndex() - 1) % this.GuideView.content.childrenCount;
          this.GuideView.setCurrentPageIndex(nextPageIndex);
          this.Forward.node.active = 0 != nextPageIndex;
          this.Next.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.ButtonAtlas.getSpriteFrame("btn_new");
        }
      };
      __decorate([ property(cc.SpriteAtlas) ], Guide.prototype, "GuideAtlas", void 0);
      __decorate([ property(cc.Animation) ], Guide.prototype, "GuideHand", void 0);
      __decorate([ property(cc.SpriteFrame) ], Guide.prototype, "GuideEnd", void 0);
      __decorate([ property(cc.Sprite) ], Guide.prototype, "Corn", void 0);
      __decorate([ property(cc.SpriteAtlas) ], Guide.prototype, "ButtonAtlas", void 0);
      __decorate([ property(cc.Button) ], Guide.prototype, "Next", void 0);
      __decorate([ property(cc.Button) ], Guide.prototype, "OK", void 0);
      __decorate([ property(cc.Button) ], Guide.prototype, "Forward", void 0);
      __decorate([ property(cc.PageView) ], Guide.prototype, "GuideView", void 0);
      __decorate([ property(cc.Button) ], Guide.prototype, "Skip", void 0);
      __decorate([ property(cc.Node) ], Guide.prototype, "Block", void 0);
      __decorate([ property(cc.Node) ], Guide.prototype, "GuideBlock", void 0);
      Guide = __decorate([ ccclass ], Guide);
      return Guide;
    }(cc.Component);
    exports.default = Guide;
    cc._RF.pop();
  }, {
    "./Poker": "Poker",
    "./controller/EventManager": "EventManager",
    "./controller/EventName": "EventName",
    "./controller/Game": "Game"
  } ],
  HashMap: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "07791aKdvNDo7wFtZ+VAQS2", "HashMap");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var HashMap = function() {
      function HashMap() {
        this._list = new Array();
        this.clear();
      }
      HashMap.prototype.getIndexByKey = function(key) {
        var count = this._list.length;
        for (var index = 0; index < count; index++) {
          var element = this._list[index];
          if (element.key == key) return index;
        }
        return -1;
      };
      HashMap.prototype.keyOf = function(value) {
        var count = this._list.length;
        for (var index = 0; index < count; index++) {
          var element = this._list[index];
          if (element.value == value) return element.key;
        }
        return null;
      };
      Object.defineProperty(HashMap.prototype, "keys", {
        get: function() {
          var keys = new Array();
          for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
            var element = _a[_i];
            element && keys.push(element.key);
          }
          return keys;
        },
        enumerable: true,
        configurable: true
      });
      HashMap.prototype.add = function(key, value) {
        var data = {
          key: key,
          value: value
        };
        var index = this.getIndexByKey(key);
        -1 != index ? this._list[index] = data : this._list.push(data);
      };
      Object.defineProperty(HashMap.prototype, "values", {
        get: function() {
          return this._list;
        },
        enumerable: true,
        configurable: true
      });
      HashMap.prototype.remove = function(key) {
        var index = this.getIndexByKey(key);
        if (-1 != index) {
          var data = this._list[index];
          this._list.splice(index, 1);
          return data;
        }
        return null;
      };
      HashMap.prototype.has = function(key) {
        var index = this.getIndexByKey(key);
        return -1 != index;
      };
      HashMap.prototype.get = function(key) {
        var index = this.getIndexByKey(key);
        if (-1 != index) {
          var data = this._list[index];
          return data.value;
        }
        return null;
      };
      Object.defineProperty(HashMap.prototype, "length", {
        get: function() {
          return this._list.length;
        },
        enumerable: true,
        configurable: true
      });
      HashMap.prototype.sort = function(compare) {
        this._list.sort(compare);
      };
      HashMap.prototype.forEachKeyValue = function(f) {
        var count = this._list.length;
        for (var index = 0; index < count; index++) {
          var element = this._list[index];
          f(element);
        }
      };
      HashMap.prototype.forEach = function(f) {
        var count = this._list.length;
        for (var index = 0; index < count; index++) {
          var element = this._list[index];
          f(element.key, element.value);
        }
      };
      HashMap.prototype.clear = function() {
        this._list = [];
      };
      return HashMap;
    }();
    exports.HashMap = HashMap;
    cc._RF.pop();
  }, {} ],
  PokerRoot: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "11cba6M6B9Awbm3ikseAzvv", "PokerRoot");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("./controller/Game");
    var Poker_1 = require("./Poker");
    var Pokers_1 = require("./Pokers");
    var EventManager_1 = require("./controller/EventManager");
    var EventName_1 = require("./controller/EventName");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var PokerRoot = function(_super) {
      __extends(PokerRoot, _super);
      function PokerRoot() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.SingleValueNode = null;
        _this.MutilpValueNode = null;
        _this.totalValue0Label = null;
        _this.totalValue0Label_MUTIP = null;
        _this.totalValue1Label = null;
        _this.TouchNode = null;
        _this.totalValue0 = 0;
        _this.totalValue1 = 0;
        _this.canTouch = false;
        _this.touchLimitTime = .3;
        _this.touchTime = 1;
        _this.flyCount = 0;
        _this.totalFlyCount = 0;
        return _this;
      }
      PokerRoot.prototype.onLoad = function() {
        this.node.on(cc.Node.EventType.CHILD_ADDED, this.onAddChild, this);
        this.node.on(cc.Node.EventType.CHILD_REMOVED, this.onChildRemove, this);
        this.TouchNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.TouchNode.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {
          e.bubbles = false;
        }, this);
        this.TouchNode.on(cc.Node.EventType.TOUCH_MOVE, function(e) {
          e.bubbles = false;
        }, this);
        this.TouchNode.on(cc.Node.EventType.TOUCH_END, function(e) {
          e.bubbles = false;
        }, this);
        this.SingleValueNode.active = true;
        this.MutilpValueNode.active = false;
      };
      PokerRoot.prototype.start = function() {
        this.canTouch = true;
      };
      PokerRoot.prototype.onTouchStart = function(e) {
        var _this = this;
        e.bubbles = false;
        Game_1.Game.isGameStarted() || Game_1.Game.start();
        if (this.touchTime < this.touchLimitTime) {
          console.error(" touch time limit!!!!!!!!!!!");
          return;
        }
        var curSelectPoker = Game_1.Game.getCurSelectPoker();
        if (!curSelectPoker || curSelectPoker.isCycled()) {
          console.error(" curSelectPoker is null!! ");
          return;
        }
        if (!this.canTouch) {
          console.error(" curSelectPoker is null!! ");
          return;
        }
        if (Game_1.Game.isBoom() || Game_1.Game.isComplete()) return;
        this.touchTime = 0;
        curSelectPoker.setRecycle(true);
        this.canTouch = false;
        var pos = CMath.ConvertToNodeSpaceAR(curSelectPoker.node, this.node);
        var oldParent = curSelectPoker.node.getParent();
        var lastPos = curSelectPoker.node.getPosition();
        var childrenCount = this.node.childrenCount;
        var offset = Pokers_1.OFFSET_Y * childrenCount - curSelectPoker.node.height / 2;
        curSelectPoker.setDefaultPosition(cc.v2(0, offset));
        curSelectPoker.node.setParent(this.node);
        console.error(" onTouchStart set parent ");
        curSelectPoker.node.setPosition(pos);
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.DEV_POKERS);
        curSelectPoker.node.group = curSelectPoker.isGuide ? "top-guide" : "top";
        curSelectPoker.node.stopActionByTag(Pokers_1.ACTION_TAG.SELECT_POKER);
        curSelectPoker.node.stopActionByTag(Pokers_1.ACTION_TAG.SHAKE);
        curSelectPoker.node.runAction(cc.sequence(cc.moveTo(.1, 0, offset), cc.callFunc(function() {
          curSelectPoker.node.group = curSelectPoker.isGuide ? "guide" : "default";
          _this.canTouch = true;
        }, this)));
        var res = this.checkAddScore(curSelectPoker.isWildCard());
        var stack = 0, streak = 0, busted = 0, cardused = 0;
        if (res[1]) busted += this.node.childrenCount; else {
          cardused += this.node.childrenCount;
          if (res[0] > 0) {
            stack += 1;
            Game_1.Game.addClearStack(1);
            streak += 1;
          }
        }
        Game_1.Game.addStep([ curSelectPoker.node ], [ oldParent ], [ lastPos ], [], [ {
          score: -res[0],
          stack: -stack,
          streak: -streak,
          cardused: -cardused,
          busted: -busted
        } ], [ CMath.ConvertToNodeSpaceAR(this.node, Game_1.Game.removeNode) ]);
      };
      PokerRoot.prototype.onChildRemove = function(child) {
        Game_1.Game.isGameStarted() && Game_1.Game.addPlacePokerRoot(parseInt(this.node.name), this.node);
        var poker = child.getComponent(Poker_1.default);
        poker && poker.setRecycle(false);
        console.warn(" on child remove update value!!!: ", this.node.childrenCount);
        this.updateTotalValue(false);
      };
      PokerRoot.prototype.updateTotalValue = function(isAdd) {
        this.totalValue0 = 0;
        this.totalValue1 = 0;
        var count = 0;
        for (var _i = 0, _a = this.node.children; _i < _a.length; _i++) {
          var pokerNode = _a[_i];
          var poker = pokerNode.getComponent(Poker_1.default);
          count++;
          if (poker.isWildCard()) {
            var value = Pokers_1.TARGET_POINT - this.totalValue0;
            this.setTotalValue(value, true, false, count, count == this.node.children.length && isAdd);
          } else this.setTotalValue(poker.getValue(), false, false, count, count == this.node.children.length && isAdd);
        }
        this.updateValueLabel();
      };
      PokerRoot.prototype.onAddChild = function(child) {
        var poker = child.getComponent(Poker_1.default);
        child.zIndex = Math.floor(Math.abs(poker.getDefaultPosition().y));
        console.error(" zIndez child value:", poker.getValue(true));
        if (!poker) return;
        poker.setRecycle(true);
        console.warn(" on child add update value!!!:", this.node.childrenCount);
        this.updateTotalValue(true);
      };
      PokerRoot.prototype.setTotalValue = function(value, isWild, isCheck, count, isEnd) {
        var addScore = 0;
        var totalValue0_test = this.totalValue0;
        var totalValue1_test = this.totalValue1;
        if (1 == value) {
          var values = [ totalValue0_test, totalValue1_test ];
          var result = [];
          for (var _i = 0, _a = [ 1, 11 ]; _i < _a.length; _i++) {
            var num = _a[_i];
            for (var _b = 0, values_1 = values; _b < values_1.length; _b++) {
              var val = values_1[_b];
              var res = val + num;
              result.indexOf(res) < 0 && result.push(res);
            }
          }
          result.sort(function(a, b) {
            return a - b;
          });
          if (result.indexOf(Pokers_1.TARGET_POINT) >= 0) totalValue0_test = totalValue1_test = Pokers_1.TARGET_POINT; else {
            totalValue0_test = result[0];
            totalValue1_test = result[1];
          }
        } else {
          totalValue0_test += value;
          totalValue1_test += value;
        }
        totalValue0_test = Math.max(0, totalValue0_test);
        totalValue1_test = Math.max(0, totalValue1_test);
        if (totalValue0_test > Pokers_1.TARGET_POINT) this.boom(isCheck); else if (isEnd) if (totalValue0_test == Pokers_1.TARGET_POINT || totalValue1_test == Pokers_1.TARGET_POINT) {
          addScore += this.complete(isWild, isCheck);
          console.error(" add Score:", addScore);
        } else if (count >= 5) addScore += this.overFive(isCheck); else if (!isCheck) {
          console.error(" pop guide 279 ");
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.POP_GUIDE_STEP);
          this.scheduleOnce(function() {
            EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.CHECK_COMPLETE, 0);
          }, .1);
        }
        if (!isCheck) {
          this.totalValue0 = totalValue0_test;
          this.totalValue1 = totalValue1_test;
        }
        console.error(" set total value score:", addScore);
        return addScore;
      };
      PokerRoot.prototype.checkAddScore = function(isWild) {
        var addScore = 0;
        var totalValue0_test = this.totalValue0;
        var totalValue1_test = this.totalValue1;
        var isBusted = false;
        if (totalValue0_test > Pokers_1.TARGET_POINT) isBusted = true; else if (totalValue0_test == Pokers_1.TARGET_POINT || totalValue1_test == Pokers_1.TARGET_POINT) {
          addScore += this.complete(isWild, true);
          this.node.childrenCount >= 5 && (addScore += Pokers_1.OVER_5_SCORE);
          console.error(" add Score:", addScore);
        } else this.node.childrenCount >= 5 ? addScore += this.overFive(true) : Game_1.Game.clearStreak();
        return [ addScore, isBusted ];
      };
      PokerRoot.prototype.updateValueLabel = function() {
        if (0 == this.totalValue1 || this.totalValue0 == this.totalValue1 || this.totalValue1 > 21) {
          this.MutilpValueNode.active = false;
          this.SingleValueNode.active = true;
        } else {
          this.MutilpValueNode.active = true;
          this.SingleValueNode.active = false;
        }
        this.totalValue0Label.string = this.totalValue0.toString();
        this.totalValue0Label_MUTIP.string = this.totalValue0.toString();
        this.totalValue1Label.string = this.totalValue1.toString();
      };
      PokerRoot.prototype.boom = function(isCheck) {
        if (!isCheck) {
          console.log(" \u8d85\u8fc721\u70b9\u7206\u6389");
          this.flyALLChildren(0);
          this.totalValue0 = 0;
          this.totalValue1 = 0;
          this.updateValueLabel();
          Game_1.Game.clearStreak();
          Game_1.Game.addRecyclePoker(1);
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PLAY_BUST);
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.BUST, parseInt(this.node.name));
          this.scheduleOnce(function() {
            EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.CHECK_COMPLETE, Pokers_1.SPECIAL_TIME_OFFSET);
          }, .1);
        }
      };
      PokerRoot.prototype.complete = function(isWild, isCheck) {
        var _this = this;
        var score = isWild ? Pokers_1.WILD_21_SCORE : Pokers_1.NORMAL_21_SCORE;
        Game_1.Game.getStreak() >= 2 && (score += (Math.min(3, Game_1.Game.getStreak()) - 1) * Pokers_1.STREAK_SCORE);
        var timeDelay = 0;
        if (!isCheck) {
          console.log(" \u5b8c\u6210 21\u70b9");
          if (this.node.childrenCount >= 5) {
            setTimeout(function() {
              Game_1.Game.addScore(Pokers_1.OVER_5_SCORE, CMath.ConvertToNodeSpaceAR(_this.node, Game_1.Game.removeNode).add(cc.v2(0, -300)));
              EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.OVER_FIVE_CARDS, parseInt(_this.node.name));
            }, Pokers_1.SPECIAL_TIME_OFFSET);
            timeDelay = Pokers_1.SPECIAL_TIME_OFFSET;
          }
          this.flyALLChildren(isWild ? Pokers_1.WILD_21_SCORE : Pokers_1.NORMAL_21_SCORE);
          isWild ? EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.WILD, parseInt(this.node.name)) : EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.COMPLETE_21, parseInt(this.node.name));
          this.totalValue0 = 0;
          this.totalValue1 = 0;
          this.updateValueLabel();
          Game_1.Game.addStreak(1);
          if (Game_1.Game.getStreak() >= 2) {
            var streak_1 = Math.min(Game_1.Game.getStreak(), 3);
            setTimeout(function() {
              Game_1.Game.addScore((streak_1 - 1) * Pokers_1.STREAK_SCORE, CMath.ConvertToNodeSpaceAR(_this.node, Game_1.Game.removeNode));
              streak_1 >= 3 ? EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.SUPER_COMBO, parseInt(_this.node.name)) : EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.COMBO, parseInt(_this.node.name));
            }, timeDelay + Pokers_1.SPECIAL_TIME_OFFSET);
          }
          this.scheduleOnce(function() {
            EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.CHECK_COMPLETE, timeDelay + Pokers_1.SPECIAL_TIME_OFFSET - 100);
          }, .1);
        }
        return score;
      };
      PokerRoot.prototype.overFive = function(isCheck) {
        var _this = this;
        var score = Pokers_1.OVER_5_SCORE;
        Game_1.Game.getStreak() >= 2 && (score += (Game_1.Game.getStreak() - 1) * Pokers_1.STREAK_SCORE);
        if (!isCheck) {
          console.log(" \u8d85\u8fc75\u5f20 ");
          var timeDelay_1 = 0;
          this.flyALLChildren(Pokers_1.OVER_5_SCORE);
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.OVER_FIVE_CARDS, parseInt(this.node.name));
          this.totalValue0 = 0;
          this.totalValue1 = 0;
          this.updateValueLabel();
          Game_1.Game.addStreak(1);
          if (Game_1.Game.getStreak() >= 2) {
            var streak_2 = Math.min(Game_1.Game.getStreak(), 3);
            setTimeout(function() {
              Game_1.Game.addScore((streak_2 - 1) * Pokers_1.STREAK_SCORE, CMath.ConvertToNodeSpaceAR(_this.node, Game_1.Game.removeNode));
              streak_2 >= 3 ? EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.SUPER_COMBO, parseInt(_this.node.name)) : EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.COMBO, parseInt(_this.node.name));
            }, Pokers_1.SPECIAL_TIME_OFFSET);
            timeDelay_1 += Pokers_1.SPECIAL_TIME_OFFSET;
          }
          this.scheduleOnce(function() {
            EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.CHECK_COMPLETE, timeDelay_1);
          }, .1);
        }
        return score;
      };
      PokerRoot.prototype.completeFly = function() {
        this.flyCount++;
        if (this.flyCount >= this.totalFlyCount) {
          this.canTouch = true;
          console.error(" pop guide completeFly");
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.POP_GUIDE_STEP);
        }
      };
      PokerRoot.prototype.flyALLChildren = function(addScore) {
        var _this = this;
        var children = this.node.children.reverse();
        var count = children.length;
        this.totalFlyCount = count;
        this.flyCount = 0;
        this.canTouch = false;
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
          var child = children_1[_i];
          var poker = child.getComponent(Poker_1.default);
          poker.autoCompleteDone(.05 * count, parseInt(this.node.name) > 1 ? -1 : 1, count, 0 == addScore, function() {
            _this.completeFly();
          });
          count--;
          count == children.length - 1 && addScore > 0 && Game_1.Game.addScore(addScore, CMath.ConvertToNodeSpaceAR(child, Game_1.Game.removeNode));
        }
      };
      PokerRoot.prototype.setNewRoot = function(poker) {};
      PokerRoot.prototype.update = function(dt) {
        this.touchTime += dt;
      };
      __decorate([ property(cc.Node) ], PokerRoot.prototype, "SingleValueNode", void 0);
      __decorate([ property(cc.Node) ], PokerRoot.prototype, "MutilpValueNode", void 0);
      __decorate([ property(cc.Label) ], PokerRoot.prototype, "totalValue0Label", void 0);
      __decorate([ property(cc.Label) ], PokerRoot.prototype, "totalValue0Label_MUTIP", void 0);
      __decorate([ property(cc.Label) ], PokerRoot.prototype, "totalValue1Label", void 0);
      __decorate([ property(cc.Node) ], PokerRoot.prototype, "TouchNode", void 0);
      PokerRoot = __decorate([ ccclass ], PokerRoot);
      return PokerRoot;
    }(cc.Component);
    exports.default = PokerRoot;
    cc._RF.pop();
  }, {
    "./Poker": "Poker",
    "./Pokers": "Pokers",
    "./controller/EventManager": "EventManager",
    "./controller/EventName": "EventName",
    "./controller/Game": "Game"
  } ],
  Pokers: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d504dBfU4JI0K2nPtJ3w844", "Pokers");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SpadeStartIndex = 0;
    exports.HeartStartIndex = 1;
    exports.ClubStartIndex = 2;
    exports.DiamondStartIndex = 3;
    exports.PokerTypes = {
      spade_: 3,
      club_: 10,
      diamond_: 5,
      heart_: 12
    };
    exports.GuidePokers = [ "spade_,7", "heart_,6", "diamond_,10", "club_,8", "spade_,1", "club_,4", "spade_,11", "heart_,2", "spade_,3", "heart_,3", "club_,3", "diamond_,3", "spade_,4", "heart_,4", "club_,4", "diamond_,4", "spade_,5", "heart_,5", "club_,5", "diamond_,5", "spade_,6", "heart_,6", "club_,6", "diamond_,6", "spade_,7", "heart_,7", "club_,7", "diamond_,7", "spade_,8", "heart_,8", "club_,8", "diamond_,8", "diamond_,9", "spade_,9", "heart_,9", "club_,9", "diamond_,10", "spade_,10", "club_,10", "heart_,10", "spade_,11", "heart_,11", "club_,11", "diamond_,11", "spade_,12", "heart_,12", "club_,12", "diamond_,12", "spade_,13", "heart_,13", "club_,13", "diamond_,13" ];
    exports.Pokers = [ "spade_,1", "heart_,1", "club_,1", "diamond_,1", "spade_,2", "heart_,2", "club_,2", "diamond_,2", "spade_,3", "heart_,3", "club_,3", "diamond_,3", "spade_,4", "heart_,4", "club_,4", "diamond_,4", "spade_,5", "heart_,5", "club_,5", "diamond_,5", "spade_,6", "heart_,6", "club_,6", "diamond_,6", "spade_,7", "heart_,7", "club_,7", "diamond_,7", "spade_,8", "heart_,8", "club_,8", "diamond_,8", "diamond_,9", "spade_,9", "heart_,9", "club_,9", "diamond_,10", "spade_,10", "club_,10", "heart_,10", "spade_,11", "heart_,11", "club_,11", "diamond_,11", "spade_,12", "heart_,12", "club_,12", "diamond_,12", "spade_,13", "heart_,13", "club_,13", "diamond_,13" ];
    exports.PokerIndex = [ 6, 5, 4, 3, 2, 1, 0, 12, 11, 10, 9, 8, 7, 17, 16, 15, 14, 13, 21, 20, 19, 18, 24, 23, 22, 26, 25, 27, 28, 29, 50, 49, 46, 43, 40, 37, 34, 31, 30, 33, 36, 39, 42, 45, 48, 51 ];
    var ACTION_TAG;
    (function(ACTION_TAG) {
      ACTION_TAG[ACTION_TAG["FLIP_CARD_REPOS_ON_ADD"] = 0] = "FLIP_CARD_REPOS_ON_ADD";
      ACTION_TAG[ACTION_TAG["FLIP_CARD_REPOS_ON_REMOVE"] = 1] = "FLIP_CARD_REPOS_ON_REMOVE";
      ACTION_TAG[ACTION_TAG["BACK_STEP"] = 2] = "BACK_STEP";
      ACTION_TAG[ACTION_TAG["DEV_POKER"] = 3] = "DEV_POKER";
      ACTION_TAG[ACTION_TAG["RE_DEV_POKER"] = 4] = "RE_DEV_POKER";
      ACTION_TAG[ACTION_TAG["SHAKE"] = 5] = "SHAKE";
      ACTION_TAG[ACTION_TAG["RECYCLE"] = 6] = "RECYCLE";
      ACTION_TAG[ACTION_TAG["POS_SCALE"] = 7] = "POS_SCALE";
      ACTION_TAG[ACTION_TAG["POS_NORMAL"] = 8] = "POS_NORMAL";
      ACTION_TAG[ACTION_TAG["SELECT_POKER"] = 9] = "SELECT_POKER";
    })(ACTION_TAG = exports.ACTION_TAG || (exports.ACTION_TAG = {}));
    var SPECIAL_TYPE;
    (function(SPECIAL_TYPE) {
      SPECIAL_TYPE[SPECIAL_TYPE["FIVE_CARDS"] = 0] = "FIVE_CARDS";
      SPECIAL_TYPE[SPECIAL_TYPE["COMPLETE_21"] = 1] = "COMPLETE_21";
      SPECIAL_TYPE[SPECIAL_TYPE["BUSTED"] = 2] = "BUSTED";
      SPECIAL_TYPE[SPECIAL_TYPE["COMBO"] = 3] = "COMBO";
      SPECIAL_TYPE[SPECIAL_TYPE["NO_BUST"] = 4] = "NO_BUST";
      SPECIAL_TYPE[SPECIAL_TYPE["SUPER_COMBO"] = 5] = "SUPER_COMBO";
      SPECIAL_TYPE[SPECIAL_TYPE["WILD"] = 6] = "WILD";
    })(SPECIAL_TYPE = exports.SPECIAL_TYPE || (exports.SPECIAL_TYPE = {}));
    exports.SPECIAL_TYPE_NAME = [ "bg_font5C", "bg_font21", "bg_fontbu", "bg_fontco", "bg_fontno", "bg_fontsco", "bg_fontwild" ];
    exports.COLOR_GRAY = cc.color(238, 218, 166);
    exports.OFFSET_Y = -70;
    exports.OFFSET_X = 0;
    exports.OFFSET_SCALE = 15;
    exports.FLIP_SCORE = 50;
    exports.BACK_STEP_SCORE = 0;
    exports.TARGET_POINT = 21;
    exports.BOOOOM_LIMIT = 3;
    exports.NORMAL_21_SCORE = 400;
    exports.WILD_21_SCORE = 200;
    exports.STREAK_SCORE = 300;
    exports.OVER_5_SCORE = 600;
    exports.NO_BUST_EXTRA_SCORE = 150;
    exports.ADD_SCORE_SPECILA_OFFSET_Y = 680;
    exports.NORMAL_SCORE_MOVE_TIME = .3;
    exports.SPECIAL_TIME_OFFSET = 500;
    exports.TOTAL_POKER_COUNT = exports.Pokers.length;
    cc._RF.pop();
  }, {} ],
  Poker: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "19c3a5acP5K/YiwGw559yBs", "Poker");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("./controller/Game");
    var Pokers_1 = require("./Pokers");
    var EventManager_1 = require("./controller/EventManager");
    var EventName_1 = require("./controller/EventName");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var CardState;
    (function(CardState) {
      CardState[CardState["Front"] = 0] = "Front";
      CardState[CardState["Back"] = 1] = "Back";
    })(CardState = exports.CardState || (exports.CardState = {}));
    var PokerColor;
    (function(PokerColor) {
      PokerColor[PokerColor["Red"] = 0] = "Red";
      PokerColor[PokerColor["Black"] = 1] = "Black";
    })(PokerColor = exports.PokerColor || (exports.PokerColor = {}));
    var PokerType;
    (function(PokerType) {
      PokerType[PokerType["Club"] = 0] = "Club";
      PokerType[PokerType["Spade"] = 1] = "Spade";
      PokerType[PokerType["Heart"] = 2] = "Heart";
      PokerType[PokerType["Diamond"] = 3] = "Diamond";
    })(PokerType = exports.PokerType || (exports.PokerType = {}));
    var POS_STATE;
    (function(POS_STATE) {
      POS_STATE[POS_STATE["NORMAL"] = 0] = "NORMAL";
      POS_STATE[POS_STATE["SCALE"] = 1] = "SCALE";
    })(POS_STATE = exports.POS_STATE || (exports.POS_STATE = {}));
    var Poker = function(_super) {
      __extends(Poker, _super);
      function Poker() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.frontCard = null;
        _this.backCard = null;
        _this.pokerAtlas = null;
        _this.RecycleAnimation = null;
        _this.WildAnimation = null;
        _this.flips = [];
        _this.value = 0;
        _this.posState = POS_STATE.NORMAL;
        _this.hasMove = false;
        _this.canMove = false;
        _this.key = -1;
        _this.next = null;
        _this.forward = null;
        _this.defualtChildCount = 0;
        _this.isCheck = false;
        _this.cycled = false;
        _this.isguided = false;
        _this.placeLimit = cc.size(0, 0);
        _this.isReadyAutoComplete = false;
        _this.recycleActionInfo = {
          startTime: 0,
          duration: 0
        };
        _this.complete = false;
        return _this;
      }
      Poker_1 = Poker;
      Poker.prototype.reuse = function() {
        this.posState = POS_STATE.NORMAL;
        this.hasMove = false;
        this.isReadyAutoComplete = false;
        var pokerInfo = arguments[0][0][0];
        console.log(" ----------------------- poker reuse ---------------------------");
        this.isguided = arguments[0][0][1];
        this.value = parseInt(pokerInfo.split(",")[1]);
        var type = pokerInfo.split(",")[0];
        this.pokerColer = "spade_" == type || "club_" == type ? PokerColor.Black : PokerColor.Red;
        switch (type) {
         case "spade_":
          this.pokerType = PokerType.Spade;
          break;

         case "club_":
          this.pokerType = PokerType.Club;
          break;

         case "heart_":
          this.pokerType = PokerType.Heart;
          break;

         case "diamond_":
          this.pokerType = PokerType.Diamond;
        }
        this.frontCard.spriteFrame = this.pokerAtlas.getSpriteFrame(pokerInfo.split(",")[0] + this.value);
        this.frontCard.spriteFrame || console.error(pokerInfo.split(",")[0] + this.value);
        this.node.rotation = 0;
        this.setCardState(CardState.Back);
        this.initEvent();
      };
      Poker.prototype.getPokerColor = function() {
        return this.pokerColer;
      };
      Poker.prototype.getPokerType = function() {
        return this.pokerType;
      };
      Poker.prototype.unuse = function() {
        this.node.targetOff(this);
        EventManager_1.gEventMgr.targetOff(this);
        this.cycled = false;
        this.node.group = "default";
      };
      Poker.prototype.getNext = function() {
        return this.next;
      };
      Poker.prototype.getForward = function() {
        return this.forward;
      };
      Poker.prototype.setNext = function(next) {
        this.next = next;
        this.node.getChildByName("Label").getComponent(cc.Label).string = "next:" + (this.next ? this.next.getValue() : "null") + ", key:" + this.key;
      };
      Poker.prototype.setForward = function(forward) {
        this.forward = forward;
      };
      Poker.prototype.setRecycle = function(cycled) {
        if (this.cycled == cycled) return;
        this.cycled = cycled;
        if (this.cycled) {
          this.RecycleAnimation.node.opacity = 0;
          this.RecycleAnimation.stop();
          Game_1.Game.addRecycleCount(1);
        } else Game_1.Game.addRecycleCount(-1);
      };
      Poker.prototype.getValue = function(isReal) {
        void 0 === isReal && (isReal = false);
        if (isReal || this.value < 10) return this.value;
        return 10;
      };
      Poker.prototype.getCardState = function() {
        return this.carState;
      };
      Poker.prototype.onLoad = function() {
        this.RecycleAnimation.node.opacity = 0;
        this.placeLimit.width = this.node.width / 2;
        this.placeLimit.height = .75 * this.node.height;
        this.node.getChildByName("Label").active = false;
        this.defualtChildCount = this.node.childrenCount;
        this.setCardState(CardState.Back);
        this.node["_onSetParent"] = this.onSetParent.bind(this);
      };
      Poker.prototype.initEvent = function() {
        var _this = this;
        this.node.on(cc.Node.EventType.CHILD_ADDED, this.onAddChild, this);
        this.node.on(cc.Node.EventType.CHILD_REMOVED, this.onChildRemove, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onMoveEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onMoveEnd, this);
        this.node.on("check-done", this.onCheckDone, this);
        this.node.on("pos-scale", function(key) {
          console.log("pos-scale:", key, _this.key, _this.isCycled(), POS_STATE[_this.posState], CardState[_this.carState], _this.value);
          if (key != _this.key || _this.isCycled() || _this.posState == POS_STATE.SCALE || _this.carState == CardState.Back) return;
          _this.setPosState(POS_STATE.SCALE);
        }, this);
        this.node.on("pos-normal", function(key) {
          console.log("pos-normal:", key, _this.key, _this.isCycled(), POS_STATE[_this.posState], CardState[_this.carState], _this.value);
          if (key != _this.key || _this.isCycled() || _this.posState == POS_STATE.NORMAL || _this.carState == CardState.Back) return;
          _this.setPosState(POS_STATE.NORMAL);
        }, this);
        EventManager_1.gEventMgr.once(EventName_1.GlobalEvent.COMPLETE, this.autoComplete, this);
        EventManager_1.gEventMgr.once(EventName_1.GlobalEvent.AUTO_COMPLETE_DONE, function() {}, this);
      };
      Poker.prototype.setComplete = function(comp) {
        this.complete = comp;
      };
      Poker.prototype.autoCompleteDone = function(delay, dir, zIndex, isBoom, callback) {
        var _this = this;
        void 0 === isBoom && (isBoom = false);
        if (this.complete) return;
        this.setComplete(true);
        var time = .15;
        this.RecycleAnimation.node.opacity = 0;
        this.RecycleAnimation.stop();
        if (this.hasMove) {
          console.log(" has move key :", this.key, ", value:", this.value);
          Game_1.Game.addPosOffset(this.key, Pokers_1.OFFSET_SCALE);
        }
        this.scheduleOnce(function() {
          var step = Game_1.Game.getTopStep();
          if (step) if (step.node.indexOf(_this.node) < 0) {
            console.log(" fuck");
            step.node.push(_this.node);
            step.lastParent.push(_this.node.getParent());
            step.lastPos.push(_this.getDefaultPosition());
          } else isBoom && (step.func ? step.func.push({
            callback: Game_1.Game.addRecyclePoker,
            args: [ -1 ],
            target: Game_1.Game
          }) : step.func = [ {
            callback: Game_1.Game.addRecyclePoker,
            args: [ -1 ],
            target: Game_1.Game
          } ]); else console.error("  fuck!!!!!!!!!!!!!!!");
        }, 0);
        this.scheduleOnce(function() {
          var selfPos = CMath.ConvertToNodeSpaceAR(_this.node, Game_1.Game.removeCardNode);
          console.error(" fuck :", isBoom);
          isBoom ? _this.node.setParent(Game_1.Game.removeBustedNode) : _this.node.setParent(Game_1.Game.removeCardNode);
          _this.node.setPosition(selfPos);
          _this.node.zIndex = zIndex;
          callback && callback();
        }, time);
        this.scheduleOnce(function() {
          var offsetX = CMath.getRandom(0, 4) * dir;
          var offsetY = CMath.getRandom(0, 16);
          _this.canMove = false;
          _this.node.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function() {
            _this.frontCard.node.opacity = 255;
            _this.node.group = _this.isguided ? "top-guide" : "top";
            Game_1.Game.addCombo(1);
            EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PLAY_POKER_FLY);
            !isBoom && EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PLAY_RECYCLE);
          }, _this), cc.sequence(cc.repeat(cc.spawn(cc.moveBy(.01, 3 * dir + offsetX, 15 + offsetY).easing(cc.easeQuinticActionOut()), cc.rotateBy(.01, 20 * dir).easing(cc.easeQuadraticActionIn())), 30), cc.repeat(cc.spawn(cc.moveBy(.01, 2 * dir + offsetX, -20).easing(cc.easeQuinticActionIn()), cc.rotateBy(.01, 20 * dir).easing(cc.easeQuadraticActionIn())), 180), cc.callFunc(function() {
            console.log("done!");
            Game_1.Game.addRemovePokerCount(1);
          }, _this))));
        }, .01 + time);
      };
      Poker.prototype.autoComplete = function() {
        if (!this.next && "PokerFlipRoot" != this.node.getParent().name || this.isCycled()) {
          this.isReadyAutoComplete = true;
          console.error(" isAutoComplete:", this.isReadyAutoComplete);
        } else this.isReadyAutoComplete = false;
      };
      Poker.prototype.onCheckDone = function(key) {
        if (this.key != key || !this.isCheck) return;
        this.setRecycle(true);
      };
      Poker.prototype.setDefaultPosition = function(pos) {
        if (pos) if (this.defaultPos) {
          this.defaultPos.x = pos.x;
          this.defaultPos.y = pos.y;
        } else this.defaultPos = pos.clone(); else this.defaultPos = this.node.position.clone();
      };
      Poker.prototype.setLastPosition = function(pos) {
        this.lastPos = pos || this.node.position.clone();
      };
      Poker.prototype.setFlipPos = function(pos) {
        this.flipPos = pos || this.node.position.clone();
      };
      Poker.prototype.getFlipPos = function() {
        return this.flipPos ? this.flipPos.clone() : this.node.position.clone();
      };
      Poker.prototype.getDefaultPosition = function() {
        return this.defaultPos ? this.defaultPos.clone() : this.node.position.clone();
      };
      Poker.prototype.getLastPosition = function() {
        return this.lastPos ? this.lastPos.clone() : this.node.position.clone();
      };
      Poker.prototype.setKey = function(key) {
        this.key = key;
        key && "NaN" == key.toString() ? this.node.getChildByName("Label").getComponent(cc.Label).string += "value:" + this.value.toString() : this.node.getChildByName("Label").getComponent(cc.Label).string = "next:" + (this.next ? this.next.getValue() : "null") + ", key:" + this.key;
        this.next && this.next.getKey() != this.key && this.next.setKey(key);
      };
      Poker.prototype.getKey = function() {
        return this.key;
      };
      Poker.prototype.onTouchStart = function(e) {
        e.bubbles = this.isCycled();
        if ([ "0", "1", "2", "3" ].indexOf(this.node.parent.name) >= 0) return;
        if (Game_1.Game.isTimeOver() || Game_1.Game.isComplete() || this.isCycled()) return;
        Game_1.Game.isGameStarted() || Game_1.Game.start();
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PLAY_POKER_PLACE);
      };
      Poker.prototype.checkAutoRecycle = function() {
        return false;
      };
      Poker.prototype.onMove = function(e) {
        return;
        var action;
        var move;
      };
      Poker.prototype.setCanMove = function(isCanMove) {
        this.canMove = isCanMove;
      };
      Poker.prototype.onMoveEnd = function(e) {
        e.bubbles = false;
        if ([ "0", "1", "2", "3" ].indexOf(this.node.parent.name) >= 0) return;
        if (Game_1.Game.isTimeOver() || Game_1.Game.isComplete() || this.isCycled()) return;
        var action = this.node.getActionByTag(Pokers_1.ACTION_TAG.SHAKE);
        if (action && !action.isDone()) return;
        this.shake();
        return;
      };
      Poker.prototype.checkCanPlace = function() {
        var _this = this;
        var index = -1;
        Game_1.Game.getPlacePokerRoot().forEach(function(key, root) {
          var poker = root.getComponent(Poker_1);
          if (_this.node.name == root.name && poker) return;
          if (poker && poker.getKey() == _this.getKey()) return;
          if (poker && Poker_1.checkBeNext(poker, _this) || !poker) {
            var pos = CMath.ConvertToNodeSpaceAR(root, _this.node.parent);
            Math.abs(pos.x - _this.node.position.x) <= _this.placeLimit.width && Math.abs(pos.y - _this.node.position.y) <= _this.placeLimit.height && (index = key);
          }
        });
        return index;
      };
      Poker.prototype.checkCanRecycled = function() {
        var _this = this;
        return -1;
        var index;
      };
      Poker.prototype.updateRootNode = function(index) {
        if (this.cycled || null == this.key || null == index) return;
        if (this.node.childrenCount <= this.defualtChildCount) {
          Game_1.Game.addPlacePokerRoot(index, this.node);
          this.check(1);
        } else {
          if (!this.next) return;
          this.next.updateRootNode.call(this.next, index);
        }
      };
      Poker.prototype.isWildCard = function() {
        return 11 == this.value && this.pokerColer == PokerColor.Black;
      };
      Poker.prototype.setWild = function() {
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PLAY_CHANGE_2_WILD);
        this.value = 11;
        this.pokerColer = PokerColor.Black;
        this.RecycleAnimation.node.opacity = 255;
        this.RecycleAnimation.play();
        this.WildAnimation.play();
        this.frontCard.spriteFrame = this.pokerAtlas.getSpriteFrame(CMath.getRandom() > .5 ? "spade_11" : "club_11");
      };
      Poker.prototype.checkPos = function() {
        if (!this.isguided && "default" != this.node.group || this.isguided && "guide" != this.node.group) {
          console.error(" checkPos");
          return;
        }
        if (this.isCycled()) return;
        var rootNode = Game_1.Game.getPlacePokerRoot().get(this.key);
        if (!rootNode) return;
        var poker = rootNode.getComponent(Poker_1);
        if (!poker) return;
        var pos = CMath.ConvertToNodeSpaceAR(rootNode, Game_1.Game.removeNode);
        var offset = Game_1.Game.getPosOffset(this.key);
        console.log(" check ----- Pos key:", poker.key, ", value:", poker.value, ", posY:", pos.y - this.node.height, ", offset:", offset);
        if (pos.y - this.node.height + offset <= Game_1.Game.pokerClip.y) {
          console.log("pos-scale-------------");
          poker.emitNodeEventToForward("pos-scale");
        } else poker.emitNodeEventToForward("pos-normal");
      };
      Poker.prototype.setPosState = function(posS, isMove) {
        void 0 === isMove && (isMove = true);
        if (this.posState == posS) return;
        this.posState = posS;
        if (this.posState == POS_STATE.NORMAL) {
          if (this.hasMove) {
            isMove && this.node.runAction(cc.moveBy(.01, 0, -Pokers_1.OFFSET_SCALE));
            var pos = this.getDefaultPosition();
            this.setDefaultPosition(cc.v2(pos.x, pos.y - Pokers_1.OFFSET_SCALE));
            Game_1.Game.addPosOffset(this.key, Pokers_1.OFFSET_SCALE);
            this.hasMove = false;
          }
          this.next && this.next.setPosState.call(this.next, POS_STATE.NORMAL);
        } else if (isMove && this.forward && this.forward.carState != CardState.Back) {
          this.hasMove = true;
          this.node.runAction(cc.moveBy(.01, 0, Pokers_1.OFFSET_SCALE));
          var pos = this.getDefaultPosition();
          this.setDefaultPosition(cc.v2(pos.x, pos.y + Pokers_1.OFFSET_SCALE));
          Game_1.Game.addPosOffset(this.key, -Pokers_1.OFFSET_SCALE);
        }
      };
      Poker.prototype.isCycled = function() {
        return this.cycled;
      };
      Poker.prototype.check = function(valua) {
        if (this.carState == CardState.Back) return;
        if (this.value == valua) {
          this.isCheck = true;
          if (13 == valua) {
            this.emitNodeEventToNext("check-done");
            Game_1.Game.clearStep();
          } else this.forward && this.forward.check.call(this.forward, valua + 1);
        } else this.isCheck = false;
      };
      Object.defineProperty(Poker.prototype, "isGuide", {
        get: function() {
          return this.isguided;
        },
        enumerable: true,
        configurable: true
      });
      Poker.prototype.shake = function() {
        if (this.isCycled()) return;
        if ([ "0", "1", "2", "3", "RemoveCardNode", "RemoveCardNodeBust", "PokerDevl", "PokerClip" ].indexOf(this.node.parent.name) >= 0) return;
        console.error(" shake:", this.node.parent.name);
        this.node.group = this.isguided ? "guide" : "default";
        var pos = this.getDefaultPosition();
        var shake = cc.sequence(cc.repeat(cc.sequence(cc.moveTo(.02, pos.x - 10, pos.y), cc.moveTo(.04, pos.x + 20, pos.y), cc.moveTo(.02, pos.x - 10, pos.y)), 3), cc.moveTo(.01, pos.x, pos.y));
        shake.setTag(Pokers_1.ACTION_TAG.SHAKE);
        this.node.stopActionByTag(Pokers_1.ACTION_TAG.SHAKE);
        this.node.setPosition(pos.x, pos.y);
        this.node.runAction(shake);
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PLAY_SHAKE);
      };
      Poker.prototype.emitNodeEventToNext = function(event) {
        this.node.emit(event, this.key);
        this.next && this.next.emitNodeEventToNext.call(this.next, event);
      };
      Poker.prototype.emitNodeEventToForward = function(event) {
        this.node.emit(event, this.key);
        this.forward && this.forward.emitNodeEventToForward.call(this.forward, event);
      };
      Poker.prototype.onAddChild = function(child) {
        var poker = child.getComponent(Poker_1);
        if (!poker) {
          console.error(" \u6ca1\u6709 Poker\u7c7b");
          return;
        }
        this.setNext(poker);
        if (this.cycled) return;
        poker.setRecycle(false);
        Poker_1.checkBeNext(this, this.next) ? this.setNormal() : this.setAllGray();
        poker.setNormal();
        this.updateRootNode(this.key);
      };
      Poker.checkBeNext = function(poker, next) {
        if (!next || !poker) return false;
        if (window["CheatOpen"]) return true;
        return poker.getValue() - next.getValue() == 1 && poker.getPokerColor() == next.getPokerColor();
      };
      Poker.checkRecycled = function(poker, next) {
        return false;
      };
      Poker.prototype.onChildRemove = function(child) {
        this.setNext(null);
        if (!Game_1.Game.isGameStarted() || Game_1.Game.isComplete()) return;
        if (this.cycled) return;
        if (this.node.childrenCount <= this.defualtChildCount) {
          Game_1.Game.addPlacePokerRoot(this.key, this.node);
          this.setNormal();
          this.checkPos();
          if (this.carState == CardState.Back) {
            this.flipCard(.1);
            Game_1.Game.addFlipCounts(1);
            Game_1.Game.addScore(Pokers_1.FLIP_SCORE, CMath.ConvertToNodeSpaceAR(this.node, Game_1.Game.removeNode));
          } else this.forward && this.forward.updateState.call(this.forward);
        }
      };
      Poker.prototype.updateState = function() {
        if (this.next) {
          if (Poker_1.checkBeNext(this, this.next) && this.next.isNormal()) this.setNormal(); else {
            this.frontCard.node.color = Pokers_1.COLOR_GRAY.clone();
            this.canMove = false;
          }
          this.forward && this.forward.updateState.call(this.forward);
        } else this.setNormal();
      };
      Poker.prototype.setAllGray = function() {
        if (!this.node.parent) return;
        this.frontCard.node.color = Pokers_1.COLOR_GRAY.clone();
        this.canMove = false;
        this.forward && this.forward.setAllGray.call(this.forward);
      };
      Poker.prototype.setNormal = function() {
        console.log("setNormal:", this.value, ", setNormal key:", this.key);
        this.frontCard.node.color = cc.Color.WHITE;
        this.canMove = this.carState == CardState.Front;
      };
      Poker.prototype.isGray = function() {
        return this.frontCard.node.color == Pokers_1.COLOR_GRAY && false == this.canMove;
      };
      Poker.prototype.setCardState = function(state, canMove) {
        void 0 === canMove && (canMove = true);
        this.carState = state;
        this.frontCard.node.scaleX = this.carState == CardState.Front ? 1 : 0;
        this.backCard.node.scaleX = this.carState == CardState.Back ? 1 : 0;
        this.canMove = this.carState == CardState.Front && canMove;
        if (this.isWildCard() && this.canMove) this.RecycleAnimation.play(); else {
          this.RecycleAnimation.node.opacity = 0;
          this.RecycleAnimation.stop();
        }
        this.canMove && this.next && !Poker_1.checkBeNext(this, this.next) && (this.canMove = false);
        if (this.canMove) {
          this.frontCard.node.color = cc.Color.WHITE;
          this.setDefaultPosition();
        } else this.forward && (this.frontCard.node.color = Pokers_1.COLOR_GRAY);
      };
      Poker.prototype.isNormal = function() {
        return this.carState == CardState.Front && this.canMove;
      };
      Poker.prototype.isFront = function() {
        return this.carState == CardState.Front;
      };
      Poker.prototype.flipCard = function(duration, canMove, callback) {
        var _this = this;
        void 0 === duration && (duration = 1);
        void 0 === canMove && (canMove = true);
        if (this.frontCard.node.getNumberOfRunningActions() > 0 || this.backCard.node.getNumberOfRunningActions() > 0) {
          console.warn("\u7ffb\u9762\u672a\u5b8c\u6210");
          this.flips.push(duration);
          return;
        }
        if (this.carState == CardState.Back) {
          this.frontCard.node.runAction(cc.sequence(cc.delayTime(duration), cc.scaleTo(duration, 1, 1), cc.callFunc(function() {
            _this.setCardState(CardState.Front, canMove);
            callback && callback();
            if (_this.flips.length > 0) {
              _this.frontCard.node.stopAllActions();
              _this.flipCard.call(_this, _this.flips.pop());
            }
          }, this)));
          this.backCard.node.runAction(cc.scaleTo(duration, 0, 1));
        } else {
          this.backCard.node.runAction(cc.sequence(cc.delayTime(duration), cc.scaleTo(duration, 1, 1), cc.callFunc(function() {
            _this.setCardState(CardState.Back, false);
            callback && callback();
            if (_this.flips.length > 0) {
              _this.backCard.node.stopAllActions();
              _this.flipCard.call(_this, _this.flips.pop());
            }
          }, this)));
          this.frontCard.node.runAction(cc.scaleTo(duration, 0, 1));
        }
      };
      Poker.prototype.start = function() {};
      Poker.prototype.update = function(dt) {
        if (this.isCycled()) return;
        this.isReadyAutoComplete && (this.isReadyAutoComplete = !this.checkAutoRecycle());
      };
      Poker.prototype.onSetParent = function(parent) {
        if (parent) if ("RemoveCardNode" == parent.name || "RemoveCardNodeBust" == parent.name) this.setComplete(true); else {
          this.setComplete(false);
          if (this.RecycleAnimation.node.opacity <= 0 && this.isWildCard() && !this.complete && !this.isCycled() && this.carState == CardState.Front) {
            this.RecycleAnimation.node.opacity = 255;
            this.RecycleAnimation.play();
          }
        }
      };
      var Poker_1;
      Poker.DebugRecycIndex = 0;
      __decorate([ property(cc.Sprite) ], Poker.prototype, "frontCard", void 0);
      __decorate([ property(cc.Sprite) ], Poker.prototype, "backCard", void 0);
      __decorate([ property(cc.SpriteAtlas) ], Poker.prototype, "pokerAtlas", void 0);
      __decorate([ property(cc.Animation) ], Poker.prototype, "RecycleAnimation", void 0);
      __decorate([ property(cc.Animation) ], Poker.prototype, "WildAnimation", void 0);
      Poker = Poker_1 = __decorate([ ccclass ], Poker);
      return Poker;
    }(cc.Component);
    exports.default = Poker;
    cc._RF.pop();
  }, {
    "./Pokers": "Pokers",
    "./controller/EventManager": "EventManager",
    "./controller/EventName": "EventName",
    "./controller/Game": "Game"
  } ],
  RecycleRoot: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bc8dfsy/SxCYZDWNhC7pOvt", "RecycleRoot");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("./controller/Game");
    var Poker_1 = require("./Poker");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var RecycleRoot = function(_super) {
      __extends(RecycleRoot, _super);
      function RecycleRoot() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      RecycleRoot.prototype.onLoad = function() {
        this.node.on(cc.Node.EventType.CHILD_ADDED, this.onAddChild, this);
        this.node.on(cc.Node.EventType.CHILD_REMOVED, this.onChildRemove, this);
      };
      RecycleRoot.prototype.onAddChild = function(child) {
        var poker = child.getComponent(Poker_1.default);
        poker && poker.setNext(null);
        Game_1.Game.addCycledPokerRoot(parseInt(this.node.name), child);
      };
      RecycleRoot.prototype.onChildRemove = function(child) {
        Game_1.Game.addCycledPokerRoot(parseInt(this.node.name), this.node);
      };
      RecycleRoot.prototype.start = function() {};
      RecycleRoot.prototype.update = function(dt) {};
      RecycleRoot = __decorate([ ccclass ], RecycleRoot);
      return RecycleRoot;
    }(cc.Component);
    exports.default = RecycleRoot;
    cc._RF.pop();
  }, {
    "./Poker": "Poker",
    "./controller/Game": "Game"
  } ],
  Result: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3d3e694EHtE55kWvZJIadml", "Result");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("./controller/Game");
    var EventManager_1 = require("./controller/EventManager");
    var EventName_1 = require("./controller/EventName");
    var celerx = require("./utils/celerx");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Result = function(_super) {
      __extends(Result, _super);
      function Result() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.Score = null;
        _this.TimeBonus = null;
        _this.FinalScore = null;
        _this.ConfirmButton = null;
        _this.Title = null;
        _this.TitleAtlas = null;
        _this.Result = null;
        _this.Light = null;
        _this.Stars = null;
        _this.Stacks = null;
        _this.ClearStackLabel = null;
        _this.CardsUsedLabel = null;
        _this.BustedLabel = null;
        _this.ComboLabel = null;
        _this.Bling = null;
        _this.score = 0;
        _this.timeBonus = 0;
        _this.finalScore = 0;
        _this.scoreStep = 0;
        _this.timeBonusStep = 0;
        _this.finalScoreStep = 0;
        _this.showScore = 0;
        _this.scoreComplete = false;
        _this.timeBonusComplete = false;
        _this.finalScoreComplete = false;
        _this.sumbit = false;
        _this.hasSubmit = false;
        return _this;
      }
      Result.prototype.onLoad = function() {
        var _this = this;
        Game_1.Game.setPause(true);
        Game_1.Game.calTimeBonus();
        var childTotal = 0;
        Game_1.Game.getPlacePokerRoot().forEach(function(key, val) {
          childTotal += val.childrenCount;
        });
        this.BustedLabel.string = Game_1.Game.removeBustedNode.childrenCount.toString();
        this.CardsUsedLabel.string = (childTotal + Game_1.Game.removeCardNode.childrenCount).toString();
        this.ComboLabel.string = Game_1.Game.getTotalStreak().toString();
        var totalStack = Game_1.Game.getClearStack();
        this.ClearStackLabel.string = totalStack.toString();
        var children = this.Stacks.children;
        if (totalStack > 0) {
          console.error("totalStack: ", totalStack);
          var _loop_1 = function(i) {
            var child = children[i];
            if (child) {
              child.active = true;
              child.runAction(cc.sequence(cc.scaleTo(0, 0, 0), cc.delayTime(i / 10), cc.scaleTo(.1, .9, .1), cc.scaleTo(.1, .9, .8), cc.callFunc(function() {
                child.anchorY = 0;
                child.y -= child.height / 2;
                child.children[0].y += child.height / 2;
              }, this_1), cc.scaleTo(.1, 1.3, 1.3), cc.scaleTo(.1, 1.05, 1.05), cc.callFunc(function() {
                child.anchorY = .5;
                child.y += child.height / 2;
                child.children[0].y -= child.height / 2;
              }, this_1), cc.scaleTo(.1, .86, .86), cc.scaleTo(.1, 1, 1), cc.callFunc(function() {
                child.getComponent(cc.Animation).play();
              }, this_1)));
            }
          };
          var this_1 = this;
          for (var i = 0; i < totalStack; i++) _loop_1(i);
        }
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.SMALL_BGM);
        var _loop_2 = function(child) {
          var action = cc.repeatForever(cc.sequence(cc.fadeIn(CMath.getRandom(.5, 1.5)).easing(cc.easeQuadraticActionInOut()), cc.fadeOut(CMath.getRandom(.4, .8)).easing(cc.easeQuadraticActionInOut())));
          child.opacity = 0;
          setTimeout(function() {
            child.runAction(action);
          }, 1e3 * CMath.getRandom(0, .5));
        };
        for (var _i = 0, _a = this.Stars.children; _i < _a.length; _i++) {
          var child = _a[_i];
          _loop_2(child);
        }
        this.Light.active = true;
        this.Light.runAction(cc.repeatForever(cc.rotateBy(5, 360)));
        this.Score.string = "0";
        this.TimeBonus.string = "0";
        this.FinalScore.string = "0";
        Game_1.Game.getGameTime() > 0 ? Game_1.Game.isBoom() ? this.Title.spriteFrame = this.TitleAtlas.getSpriteFrame("out_of_move") : this.Title.spriteFrame = this.TitleAtlas.getSpriteFrame("bg_complete") : Game_1.Game.isBoom() ? this.Title.spriteFrame = this.TitleAtlas.getSpriteFrame("out_of_move") : this.Title.spriteFrame = this.TitleAtlas.getSpriteFrame("bg_font03");
        this.Result.setEventListener(this.eventListener.bind(this));
        this.showScore = Math.max(0, Game_1.Game.getScore() - Game_1.Game.getTimeBonus());
        console.log(" result:", Game_1.Game.getScore(), ", timeBonus:", Game_1.Game.getTimeBonus(), ",showScore:", this.showScore);
        this.scoreStep = Math.ceil(this.showScore / 30);
        this.timeBonusStep = Math.ceil(Game_1.Game.getTimeBonus() / 30);
        this.finalScoreStep = Math.ceil(Game_1.Game.getScore() / 30);
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PLAY_OVER_1);
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PLAY_OVER_2);
        this.ConfirmButton.node.on(cc.Node.EventType.TOUCH_END, function() {
          true;
          window.location.reload();
        }, this);
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.RESTART, function() {
          _this.node.removeFromParent();
        }, this);
      };
      Result.prototype.eventListener = function(trackEntry, event) {
        switch (event.stringValue) {
         case "light":
          this.Light.active = true;
          this.Light.runAction(cc.repeatForever(cc.rotateBy(5, 360)));
          break;

         case "music1":
          console.log(" music1111111111111111111111111111111");
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PLAY_OVER_1);
          break;

         case "music2":
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PLAY_OVER_2);
          break;

         case "bling":
          this.Bling.node.active = true;
          this.Bling.play();
        }
      };
      Result.prototype.start = function() {};
      Result.prototype.check = function() {
        var _this = this;
        if (this.sumbit) return;
        false;
      };
      Result.prototype.update = function(dt) {
        if (this.score < this.showScore) {
          this.score += this.scoreStep;
          this.score = Math.min(this.score, this.showScore);
          this.Score.string = this.score.toString();
        } else {
          this.scoreComplete = true;
          this.check();
        }
        if (this.timeBonus < Game_1.Game.getTimeBonus()) {
          this.timeBonus += this.timeBonusStep;
          this.timeBonus = Math.min(this.timeBonus, Game_1.Game.getTimeBonus());
          this.TimeBonus.string = this.timeBonus.toString();
        } else {
          this.timeBonusComplete = true;
          this.check();
        }
        if (this.finalScore < Game_1.Game.getScore()) {
          this.finalScore += this.finalScoreStep;
          this.finalScore = Math.min(this.finalScore, Game_1.Game.getScore());
          this.FinalScore.string = this.finalScore.toString();
        } else {
          this.finalScoreComplete = true;
          this.check();
        }
      };
      __decorate([ property(cc.Label) ], Result.prototype, "Score", void 0);
      __decorate([ property(cc.Label) ], Result.prototype, "TimeBonus", void 0);
      __decorate([ property(cc.Label) ], Result.prototype, "FinalScore", void 0);
      __decorate([ property(cc.Button) ], Result.prototype, "ConfirmButton", void 0);
      __decorate([ property(cc.Sprite) ], Result.prototype, "Title", void 0);
      __decorate([ property(cc.SpriteAtlas) ], Result.prototype, "TitleAtlas", void 0);
      __decorate([ property(sp.Skeleton) ], Result.prototype, "Result", void 0);
      __decorate([ property(cc.Node) ], Result.prototype, "Light", void 0);
      __decorate([ property(cc.Node) ], Result.prototype, "Stars", void 0);
      __decorate([ property(cc.Node) ], Result.prototype, "Stacks", void 0);
      __decorate([ property(cc.Label) ], Result.prototype, "ClearStackLabel", void 0);
      __decorate([ property(cc.Label) ], Result.prototype, "CardsUsedLabel", void 0);
      __decorate([ property(cc.Label) ], Result.prototype, "BustedLabel", void 0);
      __decorate([ property(cc.Label) ], Result.prototype, "ComboLabel", void 0);
      __decorate([ property(cc.Animation) ], Result.prototype, "Bling", void 0);
      Result = __decorate([ ccclass ], Result);
      return Result;
    }(cc.Component);
    exports.default = Result;
    cc._RF.pop();
  }, {
    "./controller/EventManager": "EventManager",
    "./controller/EventName": "EventName",
    "./controller/Game": "Game",
    "./utils/celerx": "celerx"
  } ],
  ScoreLabel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "63782W3hqJOj5tpO+PG+bef", "ScoreLabel");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ScoreLabel = function(_super) {
      __extends(ScoreLabel, _super);
      function ScoreLabel() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.Score = null;
        return _this;
      }
      ScoreLabel.prototype.reuse = function() {
        this.node.scale = 0;
        console.error(arguments[0][0]);
        this.Score.string = arguments[0][0];
      };
      ScoreLabel.prototype.unuse = function() {};
      ScoreLabel.prototype.onLoad = function() {};
      ScoreLabel.prototype.start = function() {};
      __decorate([ property(cc.Label) ], ScoreLabel.prototype, "Score", void 0);
      ScoreLabel = __decorate([ ccclass ], ScoreLabel);
      return ScoreLabel;
    }(cc.Component);
    exports.default = ScoreLabel;
    cc._RF.pop();
  }, {} ],
  SpecialFont: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d50beoyZGlL6rI9Yfv8RRoD", "SpecialFont");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameFactory_1 = require("./controller/GameFactory");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var SpecialFont = function(_super) {
      __extends(SpecialFont, _super);
      function SpecialFont() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.Font = null;
        _this.callback = null;
        return _this;
      }
      SpecialFont.prototype.reuse = function() {
        var _this = this;
        this.node.position = arguments[0][1];
        this.Font.spriteFrame = arguments[0][0];
        this.callback = arguments[0][2];
        this.node.scale = 0;
        this.node.opacity = 0;
        this.callback && this.callback();
        if (arguments[0][3]) {
          console.log("  bust animation !!!!!!!!!!!!!!!!!!!!!");
          this.node.getComponent(cc.Animation).on(cc.Animation.EventType.FINISHED, function() {
            GameFactory_1.gFactory.putSpecialFont(_this.node);
            console.log(" bust animation done!!!!!!");
          }, this);
          console.log(" bust animation play !!!!!!!!!!!!!!!!!!");
          this.node.opacity = 255;
          this.node.scale = 1;
          this.node.getComponent(cc.Animation).play();
        } else this.node.runAction(cc.sequence(cc.fadeIn(0), cc.scaleTo(.2, 1.2), cc.scaleTo(.1, .9), cc.scaleTo(.1, 1.1), cc.scaleTo(.1, 1), cc.delayTime(.2), cc.fadeOut(.1), cc.callFunc(function() {
          GameFactory_1.gFactory.putSpecialFont(_this.node);
        })));
      };
      SpecialFont.prototype.unuse = function() {};
      SpecialFont.prototype.onLoad = function() {};
      __decorate([ property(cc.Sprite) ], SpecialFont.prototype, "Font", void 0);
      SpecialFont = __decorate([ ccclass ], SpecialFont);
      return SpecialFont;
    }(cc.Component);
    exports.default = SpecialFont;
    cc._RF.pop();
  }, {
    "./controller/GameFactory": "GameFactory"
  } ],
  Stop: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8765cbDuHdBm6FKOUQ5ug79", "Stop");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("./controller/Game");
    var EventManager_1 = require("./controller/EventManager");
    var EventName_1 = require("./controller/EventName");
    var Guide_1 = require("./Guide");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Stop = function(_super) {
      __extends(Stop, _super);
      function Stop() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.EndButton = null;
        _this.ResumeButton = null;
        _this.Help = null;
        _this.Content = null;
        _this.TitleAtlas = null;
        _this.Title = null;
        _this.Guide = null;
        return _this;
      }
      Stop.prototype.onLoad = function() {
        this.EndButton.node.on(cc.Node.EventType.TOUCH_END, this.endNow, this);
        this.ResumeButton.node.on(cc.Node.EventType.TOUCH_END, this.Resume, this);
        this.Help.node.on(cc.Node.EventType.TOUCH_END, this.ShowHelp, this);
        this.Content["_enableBold"](true);
      };
      Stop.prototype.endNow = function() {
        Game_1.Game.calTimeBonus();
        Game_1.Game.addGameTime(-Game_1.Game.getGameTime());
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.OPEN_RESULT, 0);
      };
      Stop.prototype.hide = function() {
        this.node.active = false;
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.NORMAL_BGM);
      };
      Stop.prototype.show = function(type) {
        this.node.active = true;
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PLAY_PAUSE);
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.SMALL_BGM);
        if (type > 0) {
          this.EndButton.node.active = false;
          this.ResumeButton.node.x = 0;
          this.Content.string = "The game has been paused, please resume.";
          this.Title.spriteFrame = this.TitleAtlas.getSpriteFrame("bg_font06");
        } else {
          this.EndButton.node.active = true;
          this.ResumeButton.node.x = -215;
          this.Content.string = "Do you want to stop now with the current score?";
          this.Title.spriteFrame = this.TitleAtlas.getSpriteFrame("bg_font01");
        }
      };
      Stop.prototype.ShowHelp = function() {
        this.hide();
        this.Guide.show(function() {
          Game_1.Game.setPause(false);
        });
      };
      Stop.prototype.Resume = function() {
        this.hide();
        Game_1.Game.setPause(false);
      };
      Stop.prototype.start = function() {};
      __decorate([ property(cc.Button) ], Stop.prototype, "EndButton", void 0);
      __decorate([ property(cc.Button) ], Stop.prototype, "ResumeButton", void 0);
      __decorate([ property(cc.Button) ], Stop.prototype, "Help", void 0);
      __decorate([ property(cc.Label) ], Stop.prototype, "Content", void 0);
      __decorate([ property(cc.SpriteAtlas) ], Stop.prototype, "TitleAtlas", void 0);
      __decorate([ property(cc.Sprite) ], Stop.prototype, "Title", void 0);
      __decorate([ property(Guide_1.default) ], Stop.prototype, "Guide", void 0);
      Stop = __decorate([ ccclass ], Stop);
      return Stop;
    }(cc.Component);
    exports.default = Stop;
    cc._RF.pop();
  }, {
    "./Guide": "Guide",
    "./controller/EventManager": "EventManager",
    "./controller/EventName": "EventName",
    "./controller/Game": "Game"
  } ],
  celerx: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "153b7Xcy2FNELHDjVpmsk/P", "celerx");
    "use strict";
    var _typeof2 = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    function binary_to_base64(e) {
      for (var r = new Uint8Array(e), t = new Array(), n = 0, i = 0, a = new Array(3), o = new Array(4), d = r.length, c = 0; d--; ) if (a[n++] = r[c++], 
      3 == n) {
        for (o[0] = (252 & a[0]) >> 2, o[1] = ((3 & a[0]) << 4) + ((240 & a[1]) >> 4), o[2] = ((15 & a[1]) << 2) + ((192 & a[2]) >> 6), 
        o[3] = 63 & a[2], n = 0; n < 4; n++) t += base64_chars.charAt(o[n]);
        n = 0;
      }
      if (n) {
        for (i = n; i < 3; i++) a[i] = 0;
        for (o[0] = (252 & a[0]) >> 2, o[1] = ((3 & a[0]) << 4) + ((240 & a[1]) >> 4), o[2] = ((15 & a[1]) << 2) + ((192 & a[2]) >> 6), 
        o[3] = 63 & a[2], i = 0; i < n + 1; i++) t += base64_chars.charAt(o[i]);
        for (;n++ < 3; ) t += "=";
      }
      return t;
    }
    function dec2hex(e) {
      for (var r = hD.substr(15 & e, 1); e > 15; ) e >>= 4, r = hD.substr(15 & e, 1) + r;
      return r;
    }
    function base64_decode(e) {
      var r, t, n, i, a, o, d, c = new Array(), s = 0, u = e;
      if (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""), u != e && alert("Warning! Characters outside Base64 range in input string ignored."), 
      e.length % 4) return alert("Error: Input length is not a multiple of 4 bytes."), 
      "";
      for (var l = 0; s < e.length; ) i = keyStr.indexOf(e.charAt(s++)), a = keyStr.indexOf(e.charAt(s++)), 
      o = keyStr.indexOf(e.charAt(s++)), d = keyStr.indexOf(e.charAt(s++)), r = i << 2 | a >> 4, 
      t = (15 & a) << 4 | o >> 2, n = (3 & o) << 6 | d, c[l++] = r, 64 != o && (c[l++] = t), 
      64 != d && (c[l++] = n);
      return c;
    }
    var _typeof = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function(e) {
      return "undefined" === typeof e ? "undefined" : _typeof2(e);
    } : function(e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : "undefined" === typeof e ? "undefined" : _typeof2(e);
    }, bridge = {
      default: void 0,
      call: function call(e, r, t) {
        var n = "";
        if ("function" == typeof r && (t = r, r = {}), r = {
          data: void 0 === r ? null : r
        }, "function" == typeof t) {
          var i = "dscb" + window.dscb++;
          window[i] = t, r._dscbstub = i;
        }
        return r = JSON.stringify(r), window._dsbridge ? n = _dsbridge.call(e, r) : (window._dswk || -1 != navigator.userAgent.indexOf("_dsbridge")) && (n = prompt("_dsbridge=" + e, r)), 
        JSON.parse(n || "{}").data;
      },
      register: function register(e, r, t) {
        t = t ? window._dsaf : window._dsf, window._dsInit || (window._dsInit = !0, setTimeout(function() {
          bridge.call("_dsb.dsinit");
        }, 0)), "object" == (void 0 === r ? "undefined" : _typeof(r)) ? t._obs[e] = r : t[e] = r;
      },
      registerAsyn: function registerAsyn(e, r) {
        this.register(e, r, !0);
      },
      hasNativeMethod: function hasNativeMethod(e, r) {
        return this.call("_dsb.hasNativeMethod", {
          name: e,
          type: r || "all"
        });
      },
      disableJavascriptDialogBlock: function disableJavascriptDialogBlock(e) {
        this.call("_dsb.disableJavascriptDialogBlock", {
          disable: !1 !== e
        });
      }
    };
    !function() {
      if (!window._dsf) {
        var e, r = {
          _dsf: {
            _obs: {}
          },
          _dsaf: {
            _obs: {}
          },
          dscb: 0,
          celerx: bridge,
          close: function close() {
            bridge.call("_dsb.closePage");
          },
          _handleMessageFromNative: function _handleMessageFromNative(e) {
            var r = JSON.parse(e.data), t = {
              id: e.callbackId,
              complete: !0
            }, n = this._dsf[e.method], i = this._dsaf[e.method], a = function a(e, n) {
              t.data = e.apply(n, r), bridge.call("_dsb.returnValue", t);
            }, o = function o(e, n) {
              r.push(function(e, r) {
                t.data = e, t.complete = !1 !== r, bridge.call("_dsb.returnValue", t);
              }), e.apply(n, r);
            };
            if (n) a(n, this._dsf); else if (i) o(i, this._dsaf); else if (n = e.method.split("."), 
            !(2 > n.length)) {
              e = n.pop();
              var n = n.join("."), i = this._dsf._obs, i = i[n] || {}, d = i[e];
              d && "function" == typeof d ? a(d, i) : (i = this._dsaf._obs, i = i[n] || {}, (d = i[e]) && "function" == typeof d && o(d, i));
            }
          }
        };
        for (e in r) window[e] = r[e];
        bridge.register("_hasJavascriptMethod", function(e, r) {
          return r = e.split("."), 2 > r.length ? !(!_dsf[r] && !_dsaf[r]) : (e = r.pop(), 
          r = r.join("."), (r = _dsf._obs[r] || _dsaf._obs[r]) && !!r[e]);
        });
      }
    }();
    var base64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", hD = "0123456789ABCDEF", keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", _provideScore = {
      callback: function callback() {
        return "";
      }
    }, _provideCurrentFrameData = {
      callback: function callback() {
        return "";
      }
    };
    bridge.register("provideScore", function() {
      return _provideScore.callback();
    }), bridge.register("provideCurrentFrameData", function() {
      return _provideCurrentFrameData.callback();
    }), module.exports = {
      onStateReceived: function onStateReceived(e) {
        return bridge.register("onStateReceived", function(r) {
          var t = base64_decode(r);
          return e(new Uint8Array(t));
        });
      },
      onCourtModeStarted: function onCourtModeStarted(e) {
        return bridge.register("onCourtModeStarted", e);
      },
      getMatch: function getMatch() {
        var e = bridge.call("getMatch", "123");
        try {
          e = JSON.parse(e);
        } catch (e) {}
        return e;
      },
      showCourtModeDialog: function showCourtModeDialog() {
        return bridge.call("showCourtModeDialog");
      },
      start: function start() {
        return bridge.call("start");
      },
      sendState: function sendState(e) {
        return bridge.call("sendState", binary_to_base64(e));
      },
      draw: function draw(e) {
        return bridge.call("draw", binary_to_base64(e));
      },
      win: function win(e) {
        return bridge.call("win", binary_to_base64(e));
      },
      lose: function lose(e) {
        return bridge.call("lose", binary_to_base64(e));
      },
      surrender: function surrender(e) {
        return bridge.call("surrender", binary_to_base64(e));
      },
      applyAction: function applyAction(e, r) {
        return bridge.call("applyAction", binary_to_base64(e), r);
      },
      getOnChainState: function getOnChainState(e) {
        return bridge.call("getOnChainState", "123", function(r) {
          var t = base64_decode(r);
          return e(new Uint8Array(t));
        });
      },
      getOnChainActionDeadline: function getOnChainActionDeadline(e) {
        return bridge.call("getOnChainActionDeadline", "123", e);
      },
      getCurrentBlockNumber: function getCurrentBlockNumber() {
        return bridge.call("getCurrentBlockNumber", "123");
      },
      finalizeOnChainGame: function finalizeOnChainGame(e) {
        return bridge.call("finalizeOnChainGame", "123", e);
      },
      submitScore: function submitScore(e) {
        return bridge.call("submitScore", e);
      },
      ready: function ready() {
        return bridge.call("ready");
      },
      onStart: function onStart(e) {
        return bridge.register("onStart", e);
      },
      provideScore: function provideScore(e) {
        return _provideScore = {
          callback: e
        };
      },
      provideCurrentFrameData: function provideCurrentFrameData(e) {
        return _provideCurrentFrameData = {
          callback: e
        };
      },
      didTakeSnapshot: function didTakeSnapshot(e) {
        return bridge.call("didTakeSnapshot", e);
      }
    };
    cc._RF.pop();
  }, {} ]
}, {}, [ "GameScene", "Guide", "Poker", "PokerRoot", "Pokers", "RecycleRoot", "Result", "ScoreLabel", "SpecialFont", "Stop", "AudioController", "EventManager", "EventName", "Game", "GameFactory", "HashMap", "celerx" ]);