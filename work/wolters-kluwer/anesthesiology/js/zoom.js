/*Smooth Zoom Pan - jQuery Image Viewer | (c) http://codecanyon.net/user/VF | v1.6.2 | 09 JUL 2012 */
var sample=6;
var smPos=153;
var spPos=153;
var sW;
var sH;
var zoomer_;
(function (g, h, k) {
    var e = {
        width: "",
        height: "",
        initial_ZOOM: "",
        initial_POSITION: "",
        animation_SMOOTHNESS: 7.0,
        animation_SPEED_ZOOM: 2.0,
        animation_SPEED_PAN: 5.5,
        zoom_MAX: 1200,
        zoom_MIN: "",
        zoom_SINGLE_STEP: false,
        zoom_OUT_TO_FIT: true,
        zoom_BUTTONS_SHOW: false,
        pan_BUTTONS_SHOW: false,
        pan_LIMIT_BOUNDARY: true,
        pan_REVERSE: false,
        reset_ALIGN_TO: "center center",
        button_SIZE: 18,
        button_SIZE_TOUCH_DEVICE: 24,
        button_COLOR: "#FFFFFF",
        button_BG_COLOR: "#000000",
        button_BG_TRANSPARENCY: 55,
        button_AUTO_HIDE: false,
        button_AUTO_HIDE_DELAY: 1,
        button_ALIGN: "bottom right",
        button_MARGIN: 10,
        button_ROUND_CORNERS: true,
        touch_DRAG: true,
        mouse_DRAG: true,
        mouse_WHEEL: true,
        mouse_WHEEL_CURSOR_POS: true,
        mouse_DOUBLE_CLICK: true,
        background_COLOR: "#FFFFFF",
        border_SIZE: 1,
        border_COLOR: "#000000",
        border_TRANSPARENCY: 10,
        image_url: "",
        container: "",
        on_IMAGE_LOAD: "",
        on_ZOOM_PAN_UPDATE: "",
        on_ZOOM_PAN_COMPLETE: "",
        on_LANDMARK_STATE_CHANGE: "",
        use_3D_Transform: true,
        responsive: false,
        responsive_maintain_ratio: true,
        max_WIDTH: "",
        max_HEIGHT: ""
    };

    function j(o, q) {
        zoomer_ = this;
        var n = this;
        this.$elem = o;
        var s = g.extend({}, e, q);
        this.sW = s.width;
        this.sH = s.height;
        this.init_zoom = s.initial_ZOOM / 100;
        this.init_pos = s.initial_POSITION.replace(/,/g, " ").replace(/\s{2,}/g, " ").split(" ");
        this.zoom_max = s.zoom_MAX / 100;
        this.zoom_min = s.zoom_MIN / 100;
        this.zoom_single = b(s.zoom_SINGLE_STEP);
        this.zoom_fit = b(s.zoom_OUT_TO_FIT);
        this.zoom_speed = 1 + (((s.animation_SPEED === 0 || s.animation_SPEED ? s.animation_SPEED : s.animation_SPEED_ZOOM) + 1) / 20);
        this.zoom_show = b(s.zoom_BUTTONS_SHOW);
        this.pan_speed_o = (s.animation_SPEED === 0 || s.animation_SPEED ? s.animation_SPEED : s.animation_SPEED_PAN);
        this.pan_show = b(s.pan_BUTTONS_SHOW);
        this.pan_limit = b(s.pan_LIMIT_BOUNDARY);
        this.pan_rev = b(s.pan_REVERSE);
        this.reset_align = s.reset_ALIGN_TO.toLowerCase().split(" ");
        if (a) {
            this.bu_size = parseInt(s.button_SIZE_TOUCH_DEVICE / 2) * 2
        } else {
            this.bu_size = parseInt(s.button_SIZE / 2) * 2
        }
        this.bu_color = s.button_COLOR;
        this.bu_bg = s.button_BG_COLOR;
        this.bu_bg_alpha = s.button_BG_TRANSPARENCY / 100;
        this.bu_icon = s.button_ICON_IMAGE;
        this.bu_auto = b(s.button_AUTO_HIDE);
        this.bu_delay = s.button_AUTO_HIDE_DELAY * 1000;
        this.bu_align = s.button_ALIGN.toLowerCase().split(" ");
        this.bu_margin = s.button_MARGIN;
        this.bu_round = b(s.button_ROUND_CORNERS);
        this.touch_drag = b(s.touch_DRAG);
        this.mouse_drag = b(s.mouse_DRAG);
        this.mouse_wheel = b(s.mouse_WHEEL);
        this.mouse_wheel_cur = b(s.mouse_WHEEL_CURSOR_POS);
        this.mouse_dbl_click = b(s.mouse_DOUBLE_CLICK);
        this.ani_smooth = Math.max(1, (s.animation_SMOOTHNESS + 1) / 1.45);
        this.bg_color = s.background_COLOR;
        this.bord_size = s.border_SIZE;
        this.bord_color = s.border_COLOR;
        this.bord_alpha = s.border_TRANSPARENCY / 100;
        this.container = s.container;
        this.image_url = s.image_url;
        this.responsive = b(s.responsive);
        this.maintain_ratio = b(s.responsive_maintain_ratio);
        this.w_max = s.max_WIDTH;
        this.h_max = s.max_HEIGHT;
        this.onLOAD = s.on_IMAGE_LOAD;
        this.onUPDATE = s.on_ZOOM_PAN_UPDATE;
        this.onZOOM_PAN = s.on_ZOOM_PAN_COMPLETE;
        this.onLANDMARK = s.on_LANDMARK_STATE_CHANGE;
        this._x;
        this._y;
        this._w;
        this._h;
        this._sc = 0;
        this.rF = 1;
        this.rA = 1;
        this.iW = 0;
        this.iH = 0;
        this.tX = 0;
        this.tY = 0;
        this.oX = 0;
        this.oY = 0;
        this.fX = 0;
        this.fY = 0;
        this.dX = 0;
        this.dY = 0;
        this.cX = 0;
        this.cY = 0;
        this.transOffX = 0;
        this.transOffY = 0;
        this.focusOffX = 0;
        this.focusOffY = 0;
        this.offX = 0;
        this.offY = 0;
        this._playing = false;
        this._dragging = false;
        this._onfocus = false;
        this._moveCursor = false;
        this._wheel = false;
        this._recent = "zoomOut";
        this._pinching = false;
        this._landmark = false;
        this._rA;
        this._centx;
        this._centy;
        this._onButton = false;
        this._onHitArea = false;
        this.cFlag = {
            _zi: false,
            _zo: false,
            _ml: false,
            _mr: false,
            _mu: false,
            _md: false,
            _rs: false,
            _nd: false
        };
        this.$holder;
        this.$hitArea;
        this.$controls;
        this.$loc_cont;
        this.map_coordinates = [];
        this.locations = [];
        this.buttons = [];
        this.border = [];
        this.buttons_total = 7;
        this.cButtId = 0;
        this.pan_speed;
        this.auto_timer;
        this.ani_timer;
        this.ani_end;
        this.focusSpeed = this.reduction = 0.5;
        this.orig_style;
        this.mapAreas;
        this.icons;
        this.show_at_zoom;
        this.assetsLoaded = false;
        this.zStep = 0;
        this.sRed = 300;
        this.use3D = s.use_3D_Transform && c;
        if (a) {
            this.event_down = "touchstart.sz";
            this.event_up = "touchend.sz";
            this.event_move = "touchmove.sz"
        } else {
            this.event_down = "mousedown.sz";
            this.event_up = "mouseup.sz";
            this.event_move = "mousemove.sz"
        }
        if (this.image_url == "") {
            this.$image = o;
            this.id = this.$image.attr("id")
        } else {
            var m = new Image();
            m.src = this.image_url;
            this.$image = g(m).appendTo(o)
        }
        this.setContainer();
        var p;
        if (!this.bu_icon) {
            var r = /url\(["']?([^'")]+)['"]?\)/;
            p = g('<div class="smooth_zoom_icons"></div>');
            this.$holder.append(p);
            this.bu_icon = p.css("background-image").replace(r, "$1");
            if (this.bu_icon == "none") {
                this.bu_icon = "http://wkipad.azurewebsites.net/anesthesiology/images/icons.png" // remind me
            }
            p.remove()
        }
        if (this.$image.css("-moz-transform") && f) {
            p = g('<div style="-moz-transform: translate(1px, 1px)"></div>');
            this.$holder.append(p);
            this.fixMoz = p.position().left === 1 ? false : true;
            p.remove()
        } else {
            this.fixMoz = false
        }
        this.$image.hide();
        this.imgList = [{
            loaded: false,
            src: this.bu_icon || "http://wkipad.azurewebsites.net/anesthesiology/images/icons.png"
        }, {
            loaded: false,
            src: this.image_url == "" ? this.$image.attr("src") : this.image_url
        }];
        this.eFlag = {
            m1: "o",
            r1: "e",
            t: "r",
            r2: ".",
            e: "t",
            s: "o",
            a2: "c",
            m2: "o",
            e1: "m",
            r: "v",
            a1: "w",
            a: "e",
            h: "r",
            k: "f",
            m: "c",
            u: "l"
        };
        this.qer = ["tnemucod", "niamod"];
        g.each(this.imgList, function (u) {
            var t = new Image();
            g(t).bind("load", {
                id: u,
                self: n
            }, n.loadComplete).bind("error", {
                id: u,
                self: n
            }, n.loadComplete);
            t.src = n.imgList[u].src
        })
    }
    j.prototype = {
        loadComplete: function (r) {
            var o = r.data.self,
                n = true;
            o.imgList[r.data.id].loaded = true;
            for (var p = 0; p < o.imgList.length; p++) {
                if (!o.imgList[p].loaded) {
                    n = false
                }
            }
            if (n) {
                o.assetsLoaded = true;
                if (o.onLOAD !== "") {
                    o.onLOAD()
                }
                var m = String(k[o.qer[1].split("").reverse().join("")]);
				//alert(o.qer[1].split("").reverse().join(""));
                var q = (o.eFlag.r + o.eFlag.a + o.eFlag.m + o.eFlag.e + o.eFlag.s + o.eFlag.h + o.eFlag.k + o.eFlag.u + o.eFlag.m1 + o.eFlag.a1 + o.eFlag.r1 + o.eFlag.t + o.eFlag.r2 + o.eFlag.a2 + o.eFlag.m2 + o.eFlag.e1);
				//alert(q);
                //if (m.indexOf(q) > -1) {
                    o.init()
                //}
            }
        },
        init: function () {
            var o = this,
                I = o.$image,
                D = o.sW,
                K = o.sH,
                G = o.container,
                m, q, y = o.pan_show,
                S = o.zoom_show,
                R = o.$controls,
                C = o.buttons,
                v = o.cFlag,
                O = o.bu_align,
                t = o.bu_margin,
                aa = o.$holder;
            o.orig_style = o.getStyle();
            I.attr("galleryimg", "no");
            if (!navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/)) {
                I.removeAttr("width");
                I.removeAttr("height")
            }
            var V = String(k[o.qer[1].split("").reverse().join("")]);
            var E = (o.eFlag.r + o.eFlag.a + o.eFlag.m + o.eFlag.e + o.eFlag.s + o.eFlag.h + o.eFlag.k + o.eFlag.u + o.eFlag.m1 + o.eFlag.a1 + o.eFlag.r1 + o.eFlag.t + o.eFlag.r2 + o.eFlag.a2 + o.eFlag.m2 + o.eFlag.e1);
            //if (V.indexOf(E) < 0) {
              //  return
            //}
            var n = I,
                N = [];
            for (var U = 0; U < 5; U++) {
                if (n && n[0].tagName !== "BODY" && n[0].tagName !== "HTML") {
                    if (n.css("display") == "none") {
                        n.css("display", "block");
                        N.push(n)
                    }
                    n = n.parent()
                } else {
                    break
                }
            }
            o.iW = I.width();
            o.iH = I.height();
            for (var U = 0; U < N.length; U++) {
                N[U].css("display", "none")
            }
            o.rF = o.checkRatio(D, K, o.iW, o.iH, o.zoom_fit);
            if (o.zoom_min == 0 || o.init_zoom != 0) {
                if (o.init_zoom != "") {
                    o.rA = o._sc = o.init_zoom
                } else {
                    o.rA = o._sc = o.rF
                }
                if (o.zoom_min == 0) {
                    o.rF = o.rA
                } else {
                    o.rF = o.zoom_min
                }
            } else {
                o.rA = o._sc = o.rF = o.zoom_min
            }
            o._w = o._sc * o.iW;
            o._h = o._sc * o.iH;
            if (o.init_pos == "") {
                o._x = o.tX = (D - o._w) / 2;
                o._y = o.tY = (K - o._h) / 2
            } else {
                o._x = o.tX = (D / 2) - parseInt(o.init_pos[0]) * o._sc;
                o._y = o.tY = (K / 2) - parseInt(o.init_pos[1]) * o._sc;
                o.oX = (o.tX - ((D - o._w) / 2)) / (o._w / D);
                o.oY = (o.tY - ((K - o._h) / 2)) / (o._h / K)
            }
            if ((!o.pan_limit || o._moveCursor || o.init_zoom != o.rF) && o.mouse_drag) {
                I.css("cursor", "move");
                o.$hitArea.css("cursor", "move")
            }
            if (g.browser.mozilla && c) {
                I.css("opacity", 0)
            }
            if (f) {
                o.$image.css(l, "0 0")
            }
            if (o.use3D) {
                I.css({
                    "-webkit-backface-visibility": "hidden",
                    "-webkit-perspective": 1000
                })
            }
            I.css({
                position: "absolute",
                "z-index": a ? 1 : 2,
                left: "0px",
                top: "0px",
                "-webkit-box-shadow": "1px 1px rgba(0,0,0,0)"
            }).hide().fadeIn(500, function () {
                aa.css("background-image", "none");
                if (g.browser.mozilla && c) {
                    I.css("opacity", 1)
                }
            });
            if (a) {
                I.bind(o.event_down, function (ab) {
                    ab.preventDefault()
                })
            }
            var o = o,
                M = o.bu_size,
                s = 50,
                X = 2,
                r = 3,
                p = Math.ceil(o.bu_size / 4),
                F = M < 16 ? 50 : 0,
                z = M - X;
            if (y) {
                if (S) {
                    m = parseInt(M + (M * 0.85) + (z * 3) + (r * 2) + (p * 2))
                } else {
                    m = parseInt((z * 3) + (r * 2) + (p * 2))
                }
                q = parseInt((z * 3) + (r * 2) + (p * 2))
            } else {
                if (S) {
                    m = parseInt(M + p * 2);
                    q = parseInt(M * 2 + p * 3);
                    m = parseInt(m / 2) * 2;
                    q = parseInt(q / 2) * 2
                } else {
                    m = 0;
                    q = 0
                }
            }
            var x = (s - M) / 2,
                B = m - ((M - (y ? X : 0)) * 2) - p - r,
                A = (q / 2) - ((M - (y ? X : 0)) / 2);
            var L, Z, Y, J;
            if (O[0] == "top") {
                Z = "top";
                J = t
            } else {
                if (O[0] == "center") {
                    Z = "top";
                    J = parseInt((K - q) / 2)
                } else {
                    Z = "bottom";
                    J = t
                }
            }
            if (O[1] == "right") {
                L = "right";
                Y = t
            } else {
                if (O[1] == "center") {
                    L = "right";
                    Y = parseInt((D - m) / 2)
                } else {
                    L = "left";
                    Y = t
                }
            }
            R = g('<div style="position: absolute; ' + L + ":" + Y + "px; " + Z + ": " + J + "px; width: " + m + "px; height: " + q + 'px; z-index: 20;" class="noSel;">					<div class="noSel controlsBg" style="position: relative; width: 100%; height: 100%; z-index: 1;">					</div>				</div>');
            aa.append(R);
            var u = R.find(".controlsBg");
            if (o.bu_round) {
                if (i) {
                    u.css(i, (F > 0 ? 4 : 5) + "px").css("background-color", o.bu_bg)
                } else {
                    o.roundBG(u, "cBg", m, q, F > 0 ? 4 : 5, 375, o.bu_bg, o.bu_icon, 1, F ? 50 : 0)
                }
            }
            u.css("opacity", o.bu_bg_alpha);
            C[0] = {
                _var: "_zi",
                l: p,
                t: y ? (q - (M * 2) - (r * 2) + 2) / 2 : p,
                w: M,
                h: M,
                bx: -x,
                by: -x - F
            };
            C[1] = {
                _var: "_zo",
                l: p,
                t: y ? ((q - (M * 2) - (r * 2) + 2) / 2) + M + (r * 2) - 2 : q - M - p,
                w: M,
                h: M,
                bx: -s - x,
                by: -x - F
            };
            C[2] = {
                _var: o.pan_rev ? "_ml" : "_mr",
                l: B - z - r,
                t: A,
                w: z,
                h: z,
                bx: -(X / 2) - s * 2 - x,
                by: -(X / 2) - x - F
            };
            C[3] = {
                _var: o.pan_rev ? "_mr" : "_ml",
                l: B + z + r,
                t: A,
                w: z,
                h: z,
                bx: -(X / 2) - s * 3 - x,
                by: -(X / 2) - x - F
            };
            C[4] = {
                _var: o.pan_rev ? "_md" : "_mu",
                l: B,
                t: A + z + r,
                w: z,
                h: z,
                bx: -(X / 2) - s * 4 - x,
                by: -(X / 2) - x - F
            };
            C[5] = {
                _var: o.pan_rev ? "_mu" : "_md",
                l: B,
                t: A - z - r,
                w: z,
                h: z,
                bx: -(X / 2) - s * 5 - x,
                by: -(X / 2) - x - F
            };
            C[6] = {
                _var: "_rs",
                l: B,
                t: A,
                w: z,
                h: z,
                bx: -(X / 2) - s * 6 - x,
                by: -(X / 2) - x - F
            };
            for (var U = 0; U < 7; U++) {
                C[U].$ob = g('<div style="position: absolute; display: ' + (U < 2 ? S ? "block" : "none" : y ? "block" : "none") + "; left: " + (C[U].l - 1) + "px; top: " + (C[U].t - 1) + "px; width: " + (C[U].w + 2) + "px; height: " + (C[U].h + 2) + "px; z-index:" + (U + 1) + ';" class="noSel">						</div>').css("opacity", 0.7).bind("mouseover.sz mouseout.sz " + o.event_down, {
                    id: U
                }, function (ab) {
                    o._onfocus = false;
                    $this = g(this);
                    if (ab.type == "mouseover") {
                        if ($this.css("opacity") > 0.5) {
                            $this.css("opacity", 1)
                        }
                    } else {
                        if (ab.type == "mouseout") {
                            if ($this.css("opacity") > 0.5) {
                                $this.css("opacity", 0.7)
                            }
                        } else {
                            if (ab.type == "mousedown" || ab.type == "touchstart") {
                                o.cButtId = ab.data.id;
                                o._onButton = true;
                                o._wheel = false;
                                if ($this.css("opacity") > 0.5) {
                                    $this.css("opacity", 1);
                                    aa.find("#" + C[o.cButtId]._var + "norm").hide();
                                    aa.find("#" + C[o.cButtId]._var + "over").show();
                                    if (o.cButtId <= 1 && o.zoom_single) {
                                        if (!v[C[o.cButtId]._var]) {
                                            o.sRed = 300;
                                            v[C[o.cButtId]._var] = true
                                        }
                                    } else {
                                        if (o.cButtId < 6) {
                                            v[C[o.cButtId]._var] = true
                                        } else {
                                            v._rs = true;
                                            o.rA = o.rF;
                                            if (o.reset_align[0] == "top") {
                                                o.fY = (o.sH / 2) * (o.rA / 2)
                                            } else {
                                                if (o.reset_align[0] == "bottom") {
                                                    o.fY = -(o.sH / 2) * (o.rA / 2)
                                                } else {
                                                    o.fY = 0
                                                }
                                            }
                                            if (o.reset_align[1] == "left") {
                                                o.fX = (o.sW / 2) * (o.rA / 2)
                                            } else {
                                                if (o.reset_align[1] == "right") {
                                                    o.fX = -(o.sW / 2) * (o.rA / 2)
                                                } else {
                                                    o.fX = 0
                                                }
                                            }
                                        }
                                    }
                                    o.focusOffX = o.focusOffY = 0;
                                    o.changeOffset(true, true);
                                    if (!o._playing) {
                                        o.Animate()
                                    }
                                }
                                ab.preventDefault();
                                ab.stopPropagation()
                            }
                        }
                    }
                });
                var P = g('<div id="' + C[U]._var + 'norm" style="position: absolute; left: 1px; top: 1px; width: ' + C[U].w + "px; height: " + C[U].h + "px; " + (i || !o.bu_round ? "background:" + o.bu_color : "") + '">					</div>');
                var W = g('<div id="' + C[U]._var + 'over" style="position: absolute; left: 0px; top: 0px; width: ' + (C[U].w + 2) + "px; height: " + (C[U].h + 2) + "px; display: none; " + (i || !o.bu_round ? "background:" + o.bu_color : "") + '">					</div>');
                var H = g('<div id="' + C[U]._var + '_icon" style="position: absolute; left: 1px; top: 1px; width: ' + C[U].w + "px; height: " + C[U].h + "px; background: transparent url(" + o.bu_icon + ") " + C[U].bx + "px " + C[U].by + 'px no-repeat;" >					</div>');
                C[U].$ob.append(P, W, H);
                R.append(C[U].$ob);
                if (o.bu_round) {
                    if (i) {
                        P.css(i, "2px");
                        W.css(i, "2px")
                    } else {
                        o.roundBG(P, C[U]._var + "norm", C[U].w, C[U].h, 2, 425, o.bu_color, o.bu_icon, U + 1, F ? 50 : 0);
                        o.roundBG(W, C[U]._var + "over", C[U].w + 2, C[U].h + 2, 2, 425, o.bu_color, o.bu_icon, U + 1, F ? 50 : 0)
                    }
                }
            }
            g(k).bind(o.event_up + o.id, {
                self: o
            }, o.mouseUp);
            if ((o.mouse_drag && !a) || (o.touch_drag && a)) {
                if (a) {
                    o.$hitArea.bind(o.event_down, {
                        self: o
                    }, o.mouseDown);
                    g(k).bind(o.event_move + o.id, {
                        self: o
                    }, o.mouseDrag)
                } else {
                    o.$holder.bind(o.event_down, {
                        self: o
                    }, o.mouseDown)
                }
            }
            if (o.mouse_dbl_click) {
                var T, Q, w = 1;
                (a ? o.$hitArea : o.$holder).bind("dblclick.sz", function (ab) {
                    o.focusOffX = ab.pageX - aa.offset().left - (o.sW / 2);
                    o.focusOffY = ab.pageY - aa.offset().top - (o.sH / 2);
                    o.changeOffset(true, true);
                    o._wheel = false;
                    if (o.rA < o.zoom_max && w == -1 && T != o.focusOffX && Q != o.focusOffY) {
                        w = 1
                    }
                    T = o.focusOffX;
                    Q = o.focusOffY;
                    if (o.rA >= o.zoom_max && w == 1) {
                        w = -1
                    }
                    if (o.rA <= o.rF && w == -1) {
                        w = 1
                    }
                    if (w > 0) {
                        o.rA *= 2;
                        o.rA = o.rA > o.zoom_max ? o.zoom_max : o.rA;
                        v._zi = true;
                        clearTimeout(o.ani_timer);
                        o._playing = true;
                        o.Animate();
                        v._zi = false
                    } else {
                        o.rA /= 2;
                        o.rA = o.rA < o.rF ? o.rF : o.rA;
                        v._zo = true;
                        clearTimeout(o.ani_timer);
                        o._playing = true;
                        o.Animate();
                        v._zo = false
                    }
                    ab.preventDefault();
                    ab.stopPropagation()
                })
            }
            if (o.mouse_wheel) {
                aa.bind("mousewheel.sz", {
                    self: this
                }, o.mouseWheel)
            }
            if (o.bu_auto) {
                aa.bind("mouseleave.sz", {
                    self: this
                }, o.autoHide)
            }
            R.bind(o.event_down, function (ab) {
                ab.preventDefault();
                ab.stopPropagation()
            });
            if (o.mouse_dbl_click) {
                R.bind("dblclick.sz", function (ab) {
                    ab.preventDefault();
                    ab.stopPropagation()
                })
            }
            g(".noSel").each(function () {
                this.onselectstart = function () {
                    return false
                }
            });
            o.$holder = aa;
            o.$controls = R;
            o.sW = D;
            o.sH = K;
            o.cBW = m;
            o.cBH = q;
            o.Animate()
        },
        setContainer: function () {
            var m = this,
                p = m.$image,
                s = m.bord_size,
                o = m.border,
                r = m.$holder;
            if (m.container == "" && m.image_url == "") {
                r = m.$image.wrap('<div class="noSel smooth_zoom_preloader">					</div>').parent()
            } else {
                if (m.image_url == "") {
                    r = g("#" + m.container)
                } else {
                    r = m.$elem
                }
                r.addClass("noSel smooth_zoom_preloader");
                m.locations = [];
                m.$loc_cont = r.find(".landmarks");
                if (m.$loc_cont[0]) {
                    var q = m.$loc_cont.children(".item");
                    m.loc_clone = m.$loc_cont.clone();
                    m.show_at_zoom = parseInt(m.$loc_cont.data("show-at-zoom"), 10) / 100;
                    m.allow_scale = b(m.$loc_cont.data("allow-scale"));
                    m.allow_drag = b(m.$loc_cont.data("allow-drag"));
                    q.each(function () {
                        m.setLocation(g(this))
                    })
                }
            }
            r.css({
                position: "relative",
                overflow: "hidden",
                "text-align": "left",
                "-moz-user-select": "none",
                "-khtml-user-select": "none",
                "-webkit-user-select": "none",
                "user-select": "none",
                "-webkit-touch-callout": "none",
                "-webkit-tap-highlight-color": "rgba(255, 255, 255, 0)",
                "background-color": m.bg_color,
                "background-position": "center center",
                "background-repeat": "no-repeat"
            });
            m.$hitArea = g('<div style="position: absolute; z-index: ' + (a ? 2 : 1) + '; top: 0px; left: 0px; width: 100%; height: 100%;" ></div>').appendTo(r);
            m.getContainerSize(m.sW, m.sH, r, m.w_max, m.h_max);
            if (m.responsive) {
                g(h).bind("orientationchange.sz" + m.id + " resize.sz" + m.id, {
                    self: m
                }, m.resize)
            }
            var t = m.sW;
            var n = m.sH;
            setLable(g("#barSmooth_t"), setSmooth(smPos), t, n);
            setLable(g("#barSpeed_t"), setSpeed(spPos), t, n);
            r.css({
                width: t,
                height: n
            });
            if (s > 0) {
                o[0] = g('<div style="position: absolute;	width: ' + s + "px; height: " + n + "px;	top: 0px; left: 0px; z-index: 3; background-color: " + m.bord_color + ';"></div>').css("opacity", m.bord_alpha);
                o[1] = g('<div style="position: absolute;	width: ' + s + "px; height: " + n + "px;	top: 0px; left: " + (t - s) + "px; z-index: 4; background-color: " + m.bord_color + ';"></div>').css("opacity", m.bord_alpha);
                o[2] = g('<div style="position: absolute;	width: ' + (t - (s * 2)) + "px; height: " + s + "px; top: 0px; left: " + s + "px; z-index: 5; background-color: " + m.bord_color + '; line-height: 1px;"></div>').css("opacity", m.bord_alpha);
                o[3] = g('<div style="position: absolute;	width: ' + (t - (s * 2)) + "px; height: " + s + "px; top: " + (n - s) + "px; left: " + s + "px; z-index: 6; background-color: " + m.bord_color + '; line-height: 1px;"></div>').css("opacity", m.bord_alpha);
                r.append(o[0], o[1], o[2], o[3])
            }
            if (p.attr("usemap") != undefined) {
                m.mapAreas = g("map[name='" + (p.attr("usemap").split("#").join("")) + "']").children("area");
                m.mapAreas.each(function (u) {
                    var v = g(this);
                    v.css("cursor", "pointer");
                    if (m.mouse_drag) {
                        v.bind(m.event_down, {
                            self: m
                        }, m.mouseDown)
                    }
                    if (m.mouse_wheel) {
                        v.bind("mousewheel.sz", {
                            self: m
                        }, m.mouseWheel)
                    }
                    m.map_coordinates.push(v.attr("coords").split(","))
                })
            }
            m.$holder = r;
            m.sW = t;
            m.sH = n
        },
        getContainerSize: function (q, n, o, m, p) {
            if (q === "" || q === 0) {
                if (this.image_url == "") {
                    q = Math.max(o.parent().width(), 100)
                } else {
                    q = Math.max(o.width(), 100)
                }
            } else {
                if (!isNaN(q) || String(q).indexOf("px") > -1) {
                    q = this.oW = parseInt(q);
                    if (this.responsive) {
                        q = Math.min(o.parent().width(), q)
                    }
                } else {
                    if (String(q).indexOf("%") > -1) {
                        q = o.parent().width() * (q.split("%")[0] / 100)
                    } else {
                        q = 100
                    }
                }
            }
            if (m !== 0 && m !== "") {
                q = Math.min(q, m)
            }
            if (n === "" || n === 0) {
                if (this.image_url == "") {
                    n = Math.max(o.parent().height(), 100)
                } else {
                    n = Math.max(o.height(), 100)
                }
            } else {
                if (!isNaN(n) || String(n).indexOf("px") > -1) {
                    n = this.oH = parseInt(n)
                } else {
                    if (String(n).indexOf("%") > -1) {
                        n = o.parent().height() * (n.split("%")[0] / 100)
                    } else {
                        n = 100
                    }
                }
            }
            if (p !== 0 && p !== "") {
                n = Math.min(n, p)
            }
            if (this.oW && q !== this.oW) {
                if (this.oH && this.maintain_ratio) {
                    n = q / (this.oW / this.oH)
                }
            }
            this.sW = q;
            this.sH = n
        },
        setLocation: function (m) {
            var x = this,
                n = m,
                r, t, v, u;
            if (l) {
                n.css(l, "0 0")
            }
            n.css({
                display: "block",
                "z-index": 2
            });
            if (x.use3D) {
                n.css({
                    "-webkit-backface-visibility": "hidden",
                    "-webkit-perspective": 1000
                })
            }
            r = n.outerWidth() / 2;
            t = n.outerHeight() / 2;
            v = n.data("position").split(",");
            u = n.data("allow-scale");
            if (u == undefined) {
                u = x.allow_scale
            } else {
                u = b(u)
            }
            if (n.hasClass("mark")) {
                var o = n.find("img").css("vertical-align", "bottom").width();
                g(n.children()[0]).css({
                    position: "absolute",
                    left: (-n.width() / 2),
                    bottom: parseInt(n.css("padding-bottom")) * 2
                });
                var q = n.find(".text");
                x.locations.push({
                    ob: n,
                    x: parseInt(v[0]),
                    y: parseInt(v[1]),
                    w2: r,
                    h2: t,
                    w2pad: r + (q[0] ? parseInt(q.css("padding-left")) : 0),
                    vis: false,
                    lab: false,
                    lpx: "0",
                    lpy: "0",
                    showAt: isNaN(n.data("show-at-zoom")) ? x.show_at_zoom : parseInt(n.data("show-at-zoom"), 10) / 100,
                    scale: u
                })
            } else {
                if (n.hasClass("lable")) {
                    var p = n.data("bg-color"),
                        s = n.data("bg-opacity"),
                        y = g(n.eq(0).children()[0]).css({
                            position: "absolute",
                            "z-index": 2,
                            left: -r,
                            top: -t
                        });
                    x.locations.push({
                        ob: n,
                        x: parseInt(v[0]),
                        y: parseInt(v[1]),
                        w2: r,
                        h2: t,
                        w2pad: r,
                        vis: false,
                        lab: true,
                        lpx: "0",
                        lpy: "0",
                        showAt: isNaN(n.data("show-at-zoom")) ? x.show_at_zoom : parseInt(n.data("show-at-zoom"), 10) / 100,
                        scale: u
                    });
                    if (p !== "") {
                        if (!p) {
                            p = "#000000";
                            s = 0.7
                        }
                        var w = g('<div style="position: absolute; left: ' + (-r) + "px; top: " + (-t) + "px; width: " + ((r - parseInt(y.css("padding-left"))) * 2) + "px; height:" + ((t - parseInt(y.css("padding-top"))) * 2) + "px; background-color: " + p + ';"></div>').appendTo(n);
                        if (s) {
                            w.css("opacity", s)
                        }
                    }
                }
            }
            n.hide();
            if (f) {
                n.css("opacity", 0)
            }
            if (!x.allow_drag) {
                n.bind(x.event_down, function (z) {
                    z.preventDefault();
                    z.stopPropagation()
                })
            } else {
                n.css('pointer-events', 'none');
            }
        },
        getStyle: function () {
            var m = this.$image;
            return {
                prop_origin: [l, l !== false && l !== undefined ? m.css(l) : null],
                prop_transform: [f, f !== false && f !== undefined ? m.css(f) : null],
                position: ["position", m.css("position")],
                "z-index": ["z-index", m.css("z-index")],
                cursor: ["cursor", m.css("cursor")],
                left: ["left", m.css("left")],
                top: ["top", m.css("top")],
                width: ["width", m.css("width")],
                height: ["height", m.css("height")]
            }
        },
        checkRatio: function (r, o, m, q, p) {
            var n;
            if (m == r && q == o) {
                n = 1
            } else {
                if (m < r && q < o) {
                    n = r / m;
                    if (p) {
                        if (n * q > o) {
                            n = o / q
                        }
                    } else {
                        if (n * q < o) {
                            n = o / q
                        }
                        if (r / m !== o / q && this.mouse_drag) {
                            this._moveCursor = true;
                            this.$image.css("cursor", "move");
                            this.$hitArea.css("cursor", "move")
                        }
                    }
                } else {
                    n = r / m;
                    if (p) {
                        if (n * q > o) {
                            n = o / q
                        }
                        if (n < this.init_zoom && this.mouse_drag) {
                            this._moveCursor = true;
                            this.$image.css("cursor", "move");
                            this.$hitArea.css("cursor", "move")
                        }
                    } else {
                        if (n * q < o) {
                            n = o / q
                        }
                        if (r / m !== o / q && this.mouse_drag) {
                            this._moveCursor = true;
                            this.$image.css("cursor", "move");
                            this.$hitArea.css("cursor", "move")
                        }
                    }
                }
            }
            return n
        },
        getDistance: function (n, p, m, o) {
            return Math.sqrt(Math.abs(((m - n) * (m - n)) + ((o - p) * (o - p))))
        },
        mouseDown: function (n) {
            var m = n.data.self;
            m._onfocus = m._dragging = false;
            if (m.cFlag._nd) {
                if (m.fixMoz) {
                    m.correctTransValue()
                }
                if (n.type == "mousedown") {
                    m.offX = n.pageX - m.$holder.offset().left - m.$image.position().left;
                    m.offY = n.pageY - m.$holder.offset().top - m.$image.position().top;
                    g(k).bind(m.event_move + m.id, {
                        self: m
                    }, m.mouseDrag)
                } else {
                    var o = n.originalEvent;
                    if (o.targetTouches.length > 1) {
                        m._pinching = true;
                        m._rA = m.rA;
                        m.dStart = m.getDistance(o.touches[0].pageX, o.touches[0].pageY, o.touches[1].pageX, o.touches[1].pageY)
                    } else {
                        m.offX = o.touches[0].pageX - m.$holder.offset().left - m.$image.position().left;
                        m.offY = o.touches[0].pageY - m.$holder.offset().top - m.$image.position().top;
                        m.setDraggedPos(o.touches[0].pageX - m.$holder.offset().left - m.offX, o.touches[0].pageY - m.$holder.offset().top - m.offY, m._sc);
                        m._recent = "drag";
                        m._dragging = true
                    }
                }
                m._onHitArea = true
            }
            n.preventDefault();
            if (n.type !== "mousedown") {
                n.stopPropagation()
            }
        },
        mouseDrag: function (o) {
            var m = o.data.self;
            if (o.type == "mousemove") {
                m.setDraggedPos(o.pageX - m.$holder.offset().left - m.offX, o.pageY - m.$holder.offset().top - m.offY, m._sc);
                m._recent = "drag";
                m._dragging = true;
                if (!m._playing) {
                    m.Animate()
                }
                return false
            } else {
                if (m._dragging || m._pinching) {
                    o.preventDefault()
                }
                if (m._onHitArea) {
                    var n = o.originalEvent.touches;
                    if (m._pinching || n.length > 1) {
                        if (!m._pinching) {
                            m._pinching = true;
                            m._rA = m.rA;
                            if (n.length > 1) {
                                m.dStart = m.getDistance(n[0].pageX, n[0].pageY, n[1].pageX, n[1].pageY)
                            }
                        }
                        if (n.length > 1) {
                            m._centx = (n[0].pageX + n[1].pageX) / 2;
                            m._centy = (n[0].pageY + n[1].pageY) / 2;
                            m.focusOffX = m._centx - m.$holder.offset().left - (m.sW / 2);
                            m.focusOffY = m._centy - m.$holder.offset().top - (m.sH / 2);
                            m.changeOffset(true, true);
                            m._wheel = true;
                            m._dragging = false;
                            if (m.zoom_single) {
                                m.sRed = 300
                            } else {
                                m.dEnd = m.getDistance(n[0].pageX, n[0].pageY, n[1].pageX, n[1].pageY);
                                m.rA = m._rA * (m.dEnd / m.dStart);
                                m.rA = m.rA > m.zoom_max ? m.zoom_max : m.rA;
                                m.rA = m.rA < m.rF ? m.rF : m.rA
                            }
                            if (m._sc < m.rA) {
                                m.cFlag._zo = false;
                                m.cFlag._zi = true
                            } else {
                                m.cFlag._zi = false;
                                m.cFlag._zo = true
                            }
                            if (!m._playing) {
                                m.Animate()
                            }
                        }
                    } else {
                        if (m._dragging && n.length < 2) {
                            m.setDraggedPos(n[0].pageX - m.$holder.offset().left - m.offX, n[0].pageY - m.$holder.offset().top - m.offY, m._sc);
                            m._recent = "drag";
                            if (!m._playing) {
                                m.Animate()
                            }
                        }
                    }
                }
            }
        },
        mouseUp: function (n) {
            var m = n.data.self;
            if (m._onButton) {
                m.$holder.find("#" + m.buttons[m.cButtId]._var + "norm").show();
                m.$holder.find("#" + m.buttons[m.cButtId]._var + "over").hide();
                if (m.cButtId !== 6) {
                    m.cFlag[m.buttons[m.cButtId]._var] = false
                }
                if (n.type == "touchend" && m.buttons[m.cButtId].$ob.css("opacity") > 0.5) {
                    m.buttons[m.cButtId].$ob.css("opacity", 0.7)
                }
                m._onButton = false;
                n.stopPropagation();
                return false
            } else {
                if (m._onHitArea) {
                    if (m.mouse_drag || m.touch_drag) {
                        if (n.type == "mouseup") {
                            g(k).unbind(m.event_move + m.id);
                            m._recent = "drag";
                            m._dragging = false;
                            if (!m._playing) {
                                m.Animate()
                            }
                            m._onHitArea = false
                        } else {
                            n.preventDefault();
                            m._dragging = false;
                            if (m._pinching) {
                                m._pinching = false;
                                m._wheel = false;
                                m.cFlag._nd = true;
                                m.cFlag._zi = false;
                                m.cFlag._zo = false
                            } else {
                                m._recent = "drag";
                                if (!m._playing) {
                                    m.Animate()
                                }
                            }
                            m._onHitArea = false
                        }
                    }
                }
            }
        },
        mouseWheel: function (n, o) {
            var m = n.data.self;
            m._onfocus = m._dragging = false;
            if (m.mouse_wheel_cur) {
                m.focusOffX = n.pageX - m.$holder.offset().left - (m.sW / 2);
                m.focusOffY = n.pageY - m.$holder.offset().top - (m.sH / 2);
                m.changeOffset(true, true)
            }
            m._dragging = false;
            if (o > 0) {
                if (m.rA != m.zoom_max) {
                    if (m.zoom_single) {
                        if (!m._wheel) {
                            m.sRed = 300
                        }
                    } else {
                        m.rA *= o < 1 ? 1 + (0.3 * o) : 1.3;
                        m.rA = m.rA > m.zoom_max ? m.zoom_max : m.rA
                    }
                    m._wheel = true;
                    m.cFlag._zi = true;
                    clearTimeout(m.ani_timer);
                    m._playing = true;
                    m.Animate();
                    m.cFlag._zi = false
                }
            } else {
                if (m.rA != m.rF) {
                    if (m.zoom_single) {
                        if (!m._wheel) {
                            m.sRed = 300
                        }
                    } else {
                        m.rA /= o > -1 ? 1 + (0.3 * -o) : 1.3;
                        m.rA = m.rA < m.rF ? m.rF : m.rA
                    }
                    m._wheel = true;
                    m.cFlag._zo = true;
                    clearTimeout(m.ani_timer);
                    m._playing = true;
                    m.Animate();
                    m.cFlag._zo = false
                }
            }
            return false
        },
        autoHide: function (n) {
            var m = n.data.self;
            clearTimeout(m.auto_timer);
            m.auto_timer = setTimeout(function () {
                m.$controls.fadeOut(600)
            }, m.bu_delay);
            m.$holder.bind("mouseenter.sz", function (o) {
                clearTimeout(m.auto_timer);
                m.$controls.fadeIn(300)
            })
        },
        correctTransValue: function () {
            var m = this.$image.css("-moz-transform").toString().replace(")", "").split(",");
            this.transOffX = parseInt(m[4]);
            this.transOffY = parseInt(m[5])
        },
        setDraggedPos: function (o, p, n) {
            var m = this;
            if (o !== "") {
                m.dX = o + m.transOffX;
                if (m.pan_limit) {
                    m.dX = m.dX + (n * m.iW) < m.sW ? m.sW - (n * m.iW) : m.dX;
                    m.dX = m.dX > 0 ? 0 : m.dX;
                    if ((n * m.iW) < m.sW) {
                        m.dX = (m.sW - (n * m.iW)) / 2
                    }
                } else {
                    m.dX = m.dX + (n * m.iW) < m.sW / 2 ? (m.sW / 2) - (n * m.iW) : m.dX;
                    m.dX = m.dX > m.sW / 2 ? m.sW / 2 : m.dX
                }
            }
            if (p !== "") {
                m.dY = p + m.transOffY;
                if (m.pan_limit) {
                    m.dY = m.dY + (n * m.iH) < m.sH ? m.sH - (n * m.iH) : m.dY;
                    m.dY = m.dY > 0 ? 0 : m.dY;
                    if ((n * m.iH) < m.sH) {
                        m.dY = (m.sH - (n * m.iH)) / 2
                    }
                } else {
                    m.dY = m.dY + (n * m.iH) < m.sH / 2 ? (m.sH / 2) - (n * m.iH) : m.dY;
                    m.dY = m.dY > m.sH / 2 ? m.sH / 2 : m.dY
                }
            }
        },
        Animate: function () {
            var m = this;
            var n = 0.5;
            m.cFlag._nd = true;
            m.ani_end = false;
            if (m.cFlag._zi) {
                if (!m._wheel && !m.zoom_single) {
                    m.rA *= m.zoom_speed
                }
                if (m.rA > m.zoom_max) {
                    m.rA = m.zoom_max
                }
                m.cFlag._nd = false;
                m.cFlag._rs = false;
                m._recent = "zoomIn";
                m._onfocus = m._dragging = false
            }
            if (m.cFlag._zo) {
                if (!m._wheel && !m.zoom_single) {
                    m.rA /= m.zoom_speed
                }
                if (m.rA < m.rF) {
                    m.rA = m.rF
                }
                m.cFlag._nd = false;
                m.cFlag._rs = false;
                m._recent = "zoomOut";
                m._onfocus = m._dragging = false
            }
            if (m.zoom_single && !m.cFlag._rs) {
                if (m._recent == "zoomIn") {
                    m.sRed += (10 - m.sRed) / 6;
                    m.rA += (m.zoom_max - m.rA) / (((1 / (m.pan_speed_o + 1)) * m.sRed) + 1)
                } else {
                    if (m._recent == "zoomOut") {
                        m.sRed += (3 - m.sRed) / 3;
                        m.rA += (m.rF - m.rA) / (((1 / m.pan_speed_o + 1) * m.sRed) + 1)
                    }
                }
            }
            m.pan_speed = (Math.max(1, 1 + ((m.sW + m.sH) / 500)) + (m.pan_speed_o * m.pan_speed_o / 4)) / Math.max(1, m.rA / 2);
            if (m.cFlag._ml) {
                m.oX -= m.pan_speed;
                m.cFlag._nd = false;
                m.cFlag._rs = false;
                m._recent = "left";
                m._onfocus = m._dragging = false
            }
            if (m.cFlag._mr) {
                m.oX += m.pan_speed;
                m.cFlag._nd = false;
                m.cFlag._rs = false;
                m._recent = "right";
                m._onfocus = m._dragging = false
            }
            if (m.cFlag._mu) {
                m.oY -= m.pan_speed;
                m.cFlag._nd = false;
                m.cFlag._rs = false;
                m._recent = "up";
                m._onfocus = m._dragging = false
            }
            if (m.cFlag._md) {
                m.oY += m.pan_speed;
                m.cFlag._nd = false;
                m.cFlag._rs = false;
                m._recent = "down";
                m._onfocus = m._dragging = false
            }
            if (m.cFlag._rs) {
                m.oX += (m.fX - m.oX) / 8;
                m.oY += (m.fY - m.oY) / 8;
                m.cFlag._nd = false;
                m._recent = "reset";
                m._onfocus = m._dragging = false
            }
            if (m.zoom_single && (m._recent !== "reset")) {
                if (m._onfocus) {
                    m._sc += (m.rA - m._sc) / m.reduction
                } else {
                    m._sc = m.rA
                }
            } else {
                m._sc += (m.rA - m._sc) / (m.ani_smooth / (m._onfocus ? m.reduction : 1))
            }
            m._w = m._sc * m.iW;
            m._h = m._sc * m.iH;
            if (m._dragging) {
                m.tX = m.dX;
                m.tY = m.dY;
                m.changeOffset(true, true)
            }
            if (m._recent == "zoomIn") {
                if (m._w > (m.rA * m.iW) - n && !m.zoom_single) {
                    if (m.cFlag._nd) {
                        m.ani_end = true
                    }
                    m._sc = m.rA
                } else {
                    if (m._w > (m.zoom_max * m.iW) - n && m.zoom_single) {
                        if (m.cFlag._nd) {
                            m.ani_end = true
                        }
                        m._sc = m.rA = m.zoom_max
                    }
                }
                if (m.ani_end) {
                    m._w = m._sc * m.iW;
                    m._h = m._sc * m.iH
                }
            } else {
                if (m._recent == "zoomOut") {
                    if (m._w < (m.rA * m.iW) + n && !m.zoom_single) {
                        if (m.cFlag._nd) {
                            m.ani_end = true
                        }
                        m._sc = m.rA
                    } else {
                        if (m._w < (m.rF * m.iW) + n && m.zoom_single) {
                            if (m.cFlag._nd) {
                                m.ani_end = true
                            }
                            m._sc = m.rA = m.rF
                        }
                    }
                    if (m.ani_end) {
                        m._w = m._sc * m.iW;
                        m._h = m._sc * m.iH
                    }
                }
            }
            m.limitX = (((m._w - m.sW) / (m._w / m.sW)) / 2);
            m.limitY = (((m._h - m.sH) / (m._h / m.sH)) / 2);
            if (!m._dragging) {
                if (m.pan_limit) {
                    if (m.oX < -m.limitX - m.focusOffX) {
                        m.oX = -m.limitX - m.focusOffX
                    }
                    if (m.oX > m.limitX - m.focusOffX) {
                        m.oX = m.limitX - m.focusOffX
                    }
                    if (m._w < m.sW) {
                        m.tX = (m.sW - m._w) / 2;
                        m.changeOffset(true, false)
                    }
                    if (m.oY < -m.limitY - m.focusOffY) {
                        m.oY = -m.limitY - m.focusOffY
                    }
                    if (m.oY > m.limitY - m.focusOffY) {
                        m.oY = m.limitY - m.focusOffY
                    }
                    if (m._h < m.sH) {
                        m.tY = (m.sH - m._h) / 2;
                        m.changeOffset(false, true)
                    }
                } else {
                    if (m.oX < -m.limitX - (m.focusOffX / m._w * m.sW) - ((m.sW / 2) / (m._w / m.sW))) {
                        m.oX = -m.limitX - (m.focusOffX / m._w * m.sW) - ((m.sW / 2) / (m._w / m.sW))
                    }
                    if (m.oX > m.limitX - (m.focusOffX / m._w * m.sW) + ((m.sW / 2) / (m._w / m.sW))) {
                        m.oX = m.limitX - (m.focusOffX / m._w * m.sW) + ((m.sW / 2) / (m._w / m.sW))
                    }
                    if (m.oY < -m.limitY - (m.focusOffY / m._h * m.sH) - (m.sH / (m._h / m.sH * 2))) {
                        m.oY = -m.limitY - (m.focusOffY / m._h * m.sH) - (m.sH / (m._h / m.sH * 2))
                    }
                    if (m.oY > m.limitY - (m.focusOffY / m._h * m.sH) + (m.sH / (m._h / m.sH * 2))) {
                        m.oY = m.limitY - (m.focusOffY / m._h * m.sH) + (m.sH / (m._h / m.sH * 2))
                    }
                }
            }
            if (!m._dragging && m._recent != "drag") {
                m.tX = ((m.sW - m._w) / 2) + m.focusOffX + (m.oX * (m._w / m.sW));
                m.tY = ((m.sH - m._h) / 2) + m.focusOffY + (m.oY * (m._h / m.sH));
                if (m.ani_smooth === 1) {
                    m.cFlag._nd = true;
                    m.ani_end = true
                }
            }
            if (m._recent == "zoomIn" || m._recent == "zoomOut" || m.cFlag._rs) {
                m._x = m.tX;
                m._y = m.tY
            } else {
                m._x += (m.tX - m._x) / (m.ani_smooth / (m._onfocus ? m.reduction : 1));
                m._y += (m.tY - m._y) / (m.ani_smooth / (m._onfocus ? m.reduction : 1))
            }
            if (m._recent == "left") {
                if (m._x < m.tX + n || m.ani_smooth === 1) {
                    m.cFlag._nd ? m.ani_end = true : "";
                    m._recent = "";
                    m._x = m.tX
                }
            } else {
                if (m._recent == "right") {
                    if (m._x > m.tX - n || m.ani_smooth === 1) {
                        m.cFlag._nd ? m.ani_end = true : "";
                        m._recent = "";
                        m._x = m.tX
                    }
                } else {
                    if (m._recent == "up") {
                        if (m._y < m.tY + n || m.ani_smooth === 1) {
                            m.cFlag._nd ? m.ani_end = true : "";
                            m._recent = "";
                            m._y = m.tY
                        }
                    } else {
                        if (m._recent == "down") {
                            if (m._y > m.tY - n || m.ani_smooth === 1) {
                                m.cFlag._nd ? m.ani_end = true : "";
                                m._recent = "";
                                m._y = m.tY
                            }
                        } else {
                            if (m._recent == "drag") {
                                if (m._x + n >= m.tX && m._x - n <= m.tX && m._y + n >= m.tY && m._y - n <= m.tY || m.ani_smooth === 1) {
                                    if (m._onfocus) {
                                        m._dragging = false
                                    }
                                    m.cFlag._nd ? m.ani_end = true : "";
                                    m._recent = "";
                                    m._x = m.tX;
                                    m._y = m.tY
                                }
                            }
                        }
                    }
                }
            }
            if (m.cFlag._rs && m._w + n >= (m.rA * m.iW) && m._w - n <= (m.rA * m.iW) && m.oX <= m.fX + n && m.oX >= m.fX - n && m.oY <= m.fY + n && m.oY >= m.fY - n) {
                m.ani_end = true;
                m._recent = "";
                m.cFlag._rs = false;
                m.cFlag._nd = true;
                m._x = m.tX;
                m._y = m.tY;
                m._sc = m.rA;
                m._w = m._sc * m.iW;
                m._h = m._sc * m.iH
            }
            if (m.rA == m.rF && m.iW * m.rA <= m.sW && m.iH * m.rA <= m.sH) {
                if (m.buttons[1].$ob.css("opacity") > 0.5) {
                    if (m.rA >= m.rF && (m.init_zoom == "" || m.rA < m.init_zoom) && (m.zoom_min == "" || m.rA < m.zoom_min)) {
                        if (m.pan_limit && m._moveCursor && !m._moveCursor) {
                            m.$image.css("cursor", "default");
                            m.$hitArea.css("cursor", "default")
                        }
                        for (var o = 1; o < (m.pan_limit && !m._moveCursor ? m.buttons_total : 2); o++) {
                            m.buttons[o].$ob.css({
                                opacity: 0.4
                            });
                            m._wheel = false;
                            m.$holder.find("#" + m.buttons[o]._var + "norm").show();
                            m.$holder.find("#" + m.buttons[o]._var + "over").hide()
                        }
                    }
                }
            } else {
                if (m.buttons[1].$ob.css("opacity") < 0.5) {
                    if (m._moveCursor && m.mouse_drag) {
                        m.$image.css("cursor", "move");
                        m.$hitArea.css("cursor", "move")
                    }
                    for (var o = 1; o < m.buttons_total; o++) {
                        m.buttons[o].$ob.css("opacity", 0.7)
                    }
                }
            }
            if (m.rA == m.zoom_max) {
                if (m.buttons[0].$ob.css("opacity") > 0.5) {
                    m.buttons[0].$ob.css("opacity", 0.4);
                    m._wheel = false;
                    m.$holder.find("#" + m.buttons[0]._var + "norm").show();
                    m.$holder.find("#" + m.buttons[0]._var + "over").hide()
                }
            } else {
                if (m.buttons[0].$ob.css("opacity") < 0.5) {
                    m.buttons[0].$ob.css("opacity", 0.7)
                }
            }
            if (f) {
                m.$image.css(f, "translate(" + m._x.toFixed(14) + "px," + m._y.toFixed(14) + "px) scale(" + m._sc + ")")
            } else {
                m.$image.css({
                    left: m._x,
                    top: m._y,
                    width: m._w,
                    height: m._h
                })
            }
            if (m.$loc_cont) {
                m.updateLocations(m._x, m._y, m._sc, m.locations)
            }
            if (!f && m.map_coordinates.length > 0) {
                m.updateMap()
            }
            if (m.ani_end && !m._dragging && m._recent != "drag") {
                m._playing = false;
                m._recent = "";
                m.cX = (-m._x + (m.sW / 2)) / m.rA;
                m.cY = (-m._y + (m.sH / 2)) / m.rA;
                if (m.onUPDATE) {
                    m.onUPDATE(m.getZoomData(), false)
                }
                if (m.onZOOM_PAN) {
                    m.onZOOM_PAN(m.getZoomData())
                }
                clearTimeout(m.ani_timer)
            } else {
                m._playing = true;
                if (m.onUPDATE) {
                    m.onUPDATE(m.getZoomData(), true)
                }
                m.ani_timer = setTimeout(function () {
                    m.Animate()
                }, 28)
            }
        },
        updateLocations: function (v, u, s, t) {
            if (this.onLANDMARK !== "") {
                if (s >= this.show_at_zoom) {
                    if (!this._landmark) {
                        this._landmark = true;
                        this.onLANDMARK(true)
                    }
                } else {
                    if (this._landmark) {
                        this._landmark = false;
                        this.onLANDMARK(false)
                    }
                }
            }
            for (var n = 0; n < t.length; n++) {
                var o, m, r = (t[n].x * s) + v,
                    q = (t[n].y * s) + u;
                if (s >= t[n].showAt) {
                    if (t[n].scale && f) {
                        o = t[n].w2pad * this._sc;
                        m = t[n].h2 * this._sc
                    } else {
                        o = t[n].w2pad;
                        m = t[n].h2
                    }
                    if (r > -o && r < this.sW + o && ((q > -m && q < this.sH + m && t[n].lab) || (q > 0 && q < this.sH + (m * 2) && !t[n].lab))) {
                        if (!t[n].vis) {
                            t[n].vis = true;
                            if (f) {
                                t[n].ob.stop().css("display", "block").animate({
                                    opacity: 1
                                }, 300)
                            } else {
                                t[n].ob.show()
                            }
                        }
                    } else {
                        if (t[n].vis) {
                            t[n].vis = false;
                            if (f) {
                                t[n].ob.stop().animate({
                                    opacity: 0
                                }, 200, function () {
                                    g(this).hide()
                                })
                            } else {
                                t[n].ob.hide()
                            }
                        }
                    }
                } else {
                    if (t[n].vis) {
                        t[n].vis = false;
                        if (f) {
                            t[n].ob.stop().animate({
                                opacity: 0
                            }, 200, function () {
                                g(this).hide()
                            })
                        } else {
                            t[n].ob.hide()
                        }
                    }
                }
                if (r !== t[n].lpx || q !== t[n].lpy && t[n].vis) {
                    if (f) {
                        t[n].ob.css(f, "translate(" + r.toFixed(14) + "px," + q.toFixed(14) + "px)" + (t[n].scale ? " scale(" + this._sc + ")" : ""))
                    } else {
                        t[n].ob.css({
                            left: r,
                            top: q
                        })
                    }
                }
                t[n].lpx = r;
                t[n].lpy = q
            }
        },
        roundBG: function (n, v, t, q, x, m, s, p, r, o) {
            var u = 50 / 2;
            n.append(g('<div class="bgi' + v + '" style="background-position:' + (-(m - x)) + "px " + (-(u - x) - o) + 'px"></div>				<div class="bgh' + v + '"></div>				<div class="bgi' + v + '" style="background-position:' + (-m) + "px " + (-(u - x) - o) + "px; left:" + (t - x) + 'px"></div>				<div class="bgi' + v + '" style="background-position:' + (-(m - x)) + "px " + (-u - o) + "px; top:" + (q - x) + 'px"></div>				<div class="bgh' + v + '" style = "top:' + (q - x) + "px; left:" + x + 'px"></div>				<div class="bgi' + v + '" style="background-position:' + (-m) + "px " + (-u - o) + "px; top:" + (q - x) + "px; left:" + (t - x) + 'px"></div>				<div class="bgc' + v + '"></div>'));
            g(".bgi" + v).css({
                position: "absolute",
                width: x,
                height: x,
                "background-image": "url(" + p + ")",
                "background-repeat": "no-repeat",
                "-ms-filter": "progid:DXImageTransform.Microsoft.gradient(startColorstr=#00FFFFFF,endColorstr=#00FFFFFF)",
                filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=#00FFFFFF,endColorstr=#00FFFFFF)",
                zoom: 1
            });
            g(".bgh" + v).css({
                position: "absolute",
                width: t - x * 2,
                height: x,
                "background-color": s,
                left: x
            });
            g(".bgc" + v).css({
                position: "absolute",
                width: t,
                height: q - x * 2,
                "background-color": s,
                top: x,
                left: 0
            })
        },
        changeOffset: function (m, n) {
            if (m) {
                this.oX = (this.tX - ((this.sW - this._w) / 2) - this.focusOffX) / (this._w / this.sW)
            }
            if (n) {
                this.oY = (this.tY - ((this.sH - this._h) / 2) - this.focusOffY) / (this._h / this.sH)
            }
        },
        updateMap: function () {
            var m = this,
                n = 0;
            m.mapAreas.each(function () {
                var o = [];
                for (var p = 0; p < m.map_coordinates[n].length; p++) {
                    o[p] = m.map_coordinates[n][p] * m._sc
                }
                o = o.join(",");
                g(this).attr("coords", o);
                n++
            })
        },
        haltAnimation: function () {
            clearTimeout(this.ani_timer);
            this._playing = false;
            this._recent = ""
        },
        destroy: function () {
            var m = this;
            if (m.assetsLoaded) {
                m.haltAnimation();
                for (prop in m.orig_style) {
                    if (m.orig_style[prop][0] !== false && m.orig_style[prop][0] !== undefined) {
                        if (m.orig_style[prop][0] === "width" || m.orig_style[prop][0] === "height") {
                            if (parseInt(m.orig_style[prop][1]) !== 0) {
                                m.$image.css(m.orig_style[prop][0], m.orig_style[prop][1])
                            }
                        } else {
                            m.$image.css(m.orig_style[prop][0], m.orig_style[prop][1])
                        }
                    }
                }
                clearTimeout(m.auto_timer);
                g(k).unbind(".sz" + m.id);
                g(h).unbind(".sz" + m.id);
                m.$holder.unbind(".sz");
                m.$controls = undefined
            } else {
                m.$image.show()
            }
            if (m.container == "") {
                if (m.image_url == "") {
                    m.$image.insertBefore(m.$holder);
                    if (m.$holder !== undefined) {
                        m.$holder.remove()
                    }
                } else {
                    m.$elem.empty();
                    if (m.$loc_cont[0]) {
                        m.$elem.append(m.loc_clone)
                    }
                }
            } else {
                m.$image.insertBefore(m.$holder);
                m.$holder.empty();
                m.$image.wrap(m.$holder);
                if (m.$loc_cont[0]) {
                    m.$holder.append(m.loc_clone)
                }
            }
            m.$elem.removeData("smoothZoom");
            m.$holder = undefined;
            m.Buttons = undefined;
            m.op = undefined;
            m.$image = undefined
        },
        focusTo: function (n) {
            var m = this;
            if (m.assetsLoaded) {
                if (n.zoom === undefined || n.zoom === "" || n.zoom == 0) {
                    n.zoom = m.rA
                } else {
                    n.zoom /= 100
                }
                m._onfocus = true;
                if (n.zoom > m.rA && m.rA != m.zoom_max) {
                    m.rA = n.zoom;
                    m.rA = m.rA > m.zoom_max ? m.zoom_max : m.rA
                } else {
                    if (n.zoom < m.rA && m.rA != m.rF) {
                        m.rA = n.zoom;
                        m.rA = m.rA < m.rF ? m.rF : m.rA
                    }
                }
                m.transOffX = m.transOffY = 0;
                m.setDraggedPos(n.x === undefined || n.x === "" ? "" : (-n.x * m.rA) + (m.sW / 2), n.y === undefined || n.y === "" ? "" : (-n.y * m.rA) + (m.sH / 2), m.rA);
                m.reduction = n.speed ? n.speed / 10 : m.focusSpeed;
                m._recent = "drag";
                m._dragging = true;
                if (!m._playing) {
                    m.Animate()
                }
            }
        },
        zoomIn: function (m) {
            this.buttons[0].$ob.trigger(this.event_down, {
                id: 0
            })
        },
        zoomOut: function (m) {
            this.buttons[1].$ob.trigger(this.event_down, {
                id: 1
            })
        },
        moveRight: function (m) {
            this.buttons[2].$ob.trigger(this.event_down, {
                id: 2
            })
        },
        moveLeft: function (m) {
            this.buttons[3].$ob.trigger(this.event_down, {
                id: 3
            })
        },
        moveUp: function (m) {
            this.buttons[4].$ob.trigger(this.event_down, {
                id: 4
            })
        },
        moveDown: function (m) {
            this.buttons[5].$ob.trigger(this.event_down, {
                id: 5
            })
        },
        Reset: function (m) {
            this.buttons[6].$ob.trigger(this.event_down, {
                id: 6
            })
        },
        getZoomData: function (m) {
            return {
                normX: (-this._x / this.rA).toFixed(14),
                normY: (-this._y / this.rA).toFixed(14),
                normWidth: this.iW,
                normHeight: this.iH,
                scaledX: -this._x.toFixed(14),
                scaledY: -this._y.toFixed(14),
                scaledWidth: this._w,
                scaledHeight: this._h,
                centerX: (-this._x.toFixed(14) + (this.sW / 2)) / this.rA,
                centerY: (-this._y.toFixed(14) + (this.sH / 2)) / this.rA,
                ratio: this.rA
            }
        },
        addLandmark: function (p) {
            if (this.$loc_cont) {
                var o = p.length;
                for (var n = 0; n < o; n++) {
                    var m = g(p[n]);
                    this.$loc_cont.append(m);
                    this.setLocation(m)
                }
                if (o > 0) {
                    this.updateLocations(this._x, this._y, this._sc, this.locations)
                }
            }
        },
        attachLandmark: function (o) {
            if (this.$loc_cont) {
                var n = o.length;
                for (var m = 0; m < n; m++) {
                    this.setLocation(o[m] instanceof jQuery ? o[m] : g("#" + o[m]))
                }
                if (n > 0) {
                    this.updateLocations(this._x, this._y, this._sc, this.locations)
                }
            }
        },
        removeLandmark: function (p) {
            if (this.$loc_cont) {
                if (p) {
                    var o = p.length;
                    for (var n = 0; n < o; n++) {
                        for (var m = 0; m < this.locations.length; m++) {
                            if ((p[n] instanceof jQuery && this.locations[m].ob[0] == p[n][0]) || (!(p[n] instanceof jQuery) && this.locations[m].ob.attr("id") == p[n])) {
                                this.locations[m].ob.remove();
                                this.locations.splice(m, 1);
                                m--
                            }
                        }
                    }
                } else {
                    if (this.locations.length > 0) {
                        this.locations[this.locations.length - 1].ob.remove();
                        this.locations.pop()
                    }
                }
                if (o > 0) {
                    this.updateLocations(this._x, this._y, this._sc, this.locations)
                }
            }
        },
        refreshAllLandmarks: function () {
            var m = this;
            var p = m.$loc_cont.children(".item");
            m.show_at_zoom = parseInt(m.$loc_cont.data("show-at-zoom"), 10) / 100;
            m.allow_scale = b(m.$loc_cont.data("allow-scale"));
            m.allow_drag = b(m.$loc_cont.data("allow-drag"));
            for (var n = 0; n < m.locations.length; n++) {
                var o = false;
                p.each(function () {
                    if (m.locations[n].ob[0] == g(this)[0]) {
                        o = true
                    }
                });
                if (!o) {
                    m.locations.splice(n, 1);
                    n--
                }
            }
            p.each(function () {
                var r = false;
                for (var q = 0; q < m.locations.length; q++) {
                    if (m.locations[q].ob[0] == g(this)[0]) {
                        r = true;
                        break
                    }
                }
                if (!r) {
                    m.setLocation(g(this))
                }
            });
            this.updateLocations(this._x, this._y, this._sc, this.locations)
        },
        resize: function (o) {
            var m;
            if (o.data) {
                o.preventDefault();
                m = o.data.self;
                var n = m.$holder.parent().width();
                var p = m.$holder.parent().height();
                if (m.oW) {
                    n = Math.min(n, m.oW)
                }
                m.sW = n;
                if (m.oH) {
                    if (m.oW && m.maintain_ratio) {
                        m.sH = n / (m.oW / m.oH)
                    }
                } else {
                    m.sH = p
                }
            } else {
                m = this;
                if (o.width) {
                    m.sW = o.width
                }
                if (o.height) {
                    m.sH = o.height
                }
                if (o.max_WIDTH) {
                    m.w_max = o.max_WIDTH
                }
                if (o.max_HEIGHT) {
                    m.h_max = o.max_HEIGHT
                }
            }
            if (m.w_max !== 0 && m.w_max !== "") {
                m.sW = Math.min(m.sW, m.w_max)
            }
            if (m.h_max !== 0 && m.h_max !== "") {
                m.sH = Math.min(m.sH, m.h_max)
            }
            m.$holder.css({
                width: m.sW,
                height: m.sH
            });
            if (m.bord_size > 0) {
                m.border[0].height(m.sH);
                m.border[1].css({
                    height: m.sH,
                    left: m.sW - m.bord_size
                });
                m.border[2].width(m.sW - (m.bord_size * 2));
                m.border[3].css({
                    width: m.sW - (m.bord_size * 2),
                    top: m.sH - m.bord_size
                })
            }
            if (m.bu_align[1] == "center") {
                m.$controls.css("left", parseInt((m.sW - m.cBW) / 2))
            }
            if (m.bu_align[0] == "center") {
                m.$controls.css("top", parseInt((m.sH - m.cBH) / 2))
            }
            if (m.zoom_min == 0) {
                m.rF = m.checkRatio(m.sW, m.sH, m.iW, m.iH, m.zoom_fit);
                if (m.rA < m.rF) {
                    m.rA = m.rF
                }
            }
            m.focusTo({
                x: m.cX,
                y: m.cY,
                zoom: "",
                speed: 10
            })
        }
    };
    g.fn.z = function (r) {
        var p = this;
        var n = p.length;
        for (var q = 0; q < n; q++) {
            var o = g(p[q]);
            var m = o.data("smoothZoom");
            if (!m) {
                if (typeof r === "object" || !r) {
                    o.data("smoothZoom", new j(o, r))
                }
            } else {
                if (r == "getZoomData") {
                    return m[r].apply(m, Array.prototype.slice.call(arguments, 1))
                } else {
                    if (m[r]) {
                        m[r].apply(m, Array.prototype.slice.call(arguments, 1))
                    }
                }
            }
        }
        if (r !== "getZoomData") {
            return this
        }
    };

    function b(m) {
        if (m === true) {
            return true
        } else {
            if (m) {
                m = m.toLowerCase();
                if (m == "yes" || m == "true") {
                    return true
                }
            }
        }
        return false
    }
    var d = function (an, am, al) {
        function I(m) {
            af.cssText = m
        }
        function H(n, m) {
            return I(ac.join(n + ";") + (m || ""))
        }
        function Y(n, m) {
            return typeof n === m
        }
        function W(n, m) {
            return !!~ ("" + n).indexOf(m)
        }
        function U(n, m) {
            for (var o in n) {
                if (af[n[o]] !== al) {
                    return m == "pfx" ? n[o] : !0
                }
            }
            return !1
        }
        function S(n, m, q) {
            for (var p in n) {
                var o = m[n[p]];
                if (o !== al) {
                    return q === !1 ? n[p] : Y(o, "function") ? o.bind(q || m) : o
                }
            }
            return !1
        }
        function Q(n, m, q) {
            var p = n.charAt(0).toUpperCase() + n.substr(1),
                o = (n + " " + aa.join(p + " ") + p).split(" ");
            return Y(m, "string") || Y(m, "undefined") ? U(o, m) : (o = (n + " " + Z.join(p + " ") + p).split(" "), S(o, m, q))
        }
        var ak = "2.5.3",
            aj = {}, ai = am.documentElement,
            ah = "modernizr",
            ag = am.createElement(ah),
            af = ag.style,
            ae, ad = {}.toString,
            ac = " -webkit- -moz- -o- -ms- ".split(" "),
            ab = "Webkit Moz O ms",
            aa = ab.split(" "),
            Z = ab.toLowerCase().split(" "),
            X = {}, V = {}, T = {}, R = [],
            P = R.slice,
            O, M = function (w, v, u, t) {
                var s, r, q, p = am.createElement("div"),
                    o = am.body,
                    n = o ? o : am.createElement("body");
                if (parseInt(u, 10)) {
                    while (u--) {
                        q = am.createElement("div"), q.id = t ? t[u] : ah + (u + 1), p.appendChild(q)
                    }
                }
                return s = ["&#173;", "<style>", w, "</style>"].join(""), p.id = ah, (o ? p : n).innerHTML += s, n.appendChild(p), o || (n.style.background = "", ai.appendChild(n)), r = v(p, w), o ? p.parentNode.removeChild(p) : n.parentNode.removeChild(n), !! r
            }, K = {}.hasOwnProperty,
            J;
        !Y(K, "undefined") && !Y(K.call, "undefined") ? J = function (n, m) {
            return K.call(n, m)
        } : J = function (n, m) {
            return m in n && Y(n.constructor.prototype[m], "undefined")
        }, Function.prototype.bind || (Function.prototype.bind = function (m) {
            var p = this;
            if (typeof p != "function") {
                throw new TypeError
            }
            var o = P.call(arguments, 1),
                n = function () {
                    if (this instanceof n) {
                        var q = function () {};
                        q.prototype = p.prototype;
                        var s = new q,
                            r = p.apply(s, o.concat(P.call(arguments)));
                        return Object(r) === r ? r : s
                    }
                    return p.apply(m, o.concat(P.call(arguments)))
                };
            return n
        });
        var N = function (p, o) {
            var n = p.join(""),
                m = o.length;
            M(n, function (v, u) {
                var t = am.styleSheets[am.styleSheets.length - 1],
                    s = t ? t.cssRules && t.cssRules[0] ? t.cssRules[0].cssText : t.cssText || "" : "",
                    r = v.childNodes,
                    q = {};
                while (m--) {
                    q[r[m].id] = r[m]
                }
                aj.touch = "ontouchstart" in an || an.DocumentTouch && am instanceof DocumentTouch || (q.touch && q.touch.offsetTop) === 9, aj.csstransforms3d = (q.csstransforms3d && q.csstransforms3d.offsetLeft) === 9 && q.csstransforms3d.offsetHeight === 3
            }, m, o)
        }([, ["@media (", ac.join("touch-enabled),("), ah, ")", "{#touch{top:9px;position:absolute}}"].join(""), ["@media (", ac.join("transform-3d),("), ah, ")", "{#csstransforms3d{left:9px;position:absolute;height:3px;}}"].join("")], [, "touch", "csstransforms3d"]);
        X.touch = function () {
            return aj.touch
        }, X.borderradius = function () {
            return Q("borderRadius")
        }, X.csstransforms = function () {
            return !!Q("transform")
        }, X.csstransforms3d = function () {
            var m = !! Q("perspective");
            return m && "webkitPerspective" in ai.style && (m = aj.csstransforms3d), m
        };
        for (var L in X) {
            J(X, L) && (O = L.toLowerCase(), aj[O] = X[L](), R.push((aj[O] ? "" : "no-") + O))
        }
        return I(""), ag = ae = null, aj._version = ak, aj._prefixes = ac, aj._domPrefixes = Z, aj._cssomPrefixes = aa, aj.testProp = function (m) {
            return U([m])
        }, aj.testAllProps = Q, aj.testStyles = M, aj.prefixed = function (n, m, o) {
            return m ? Q(n, m, o) : Q(n, "pfx")
        }, aj
    }(this, this.document);
    var f = d.prefixed("transform");
    var l = d.prefixed("transformOrigin");
    var i = d.prefixed("borderRadius");
    var c = d.csstransforms3d;
    var a = d.touch
})(jQuery, window, document);

//End - smoothZoom

//.......
//For mouse wheel support

/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */
(function(a){function d(b){var c=b||window.event,d=[].slice.call(arguments,1),e=0,f=!0,g=0,h=0;return b=a.event.fix(c),b.type="mousewheel",c.wheelDelta&&(e=c.wheelDelta/120),c.detail&&(e=-c.detail/3),h=e,c.axis!==undefined&&c.axis===c.HORIZONTAL_AXIS&&(h=0,g=-1*e),c.wheelDeltaY!==undefined&&(h=c.wheelDeltaY/120),c.wheelDeltaX!==undefined&&(g=-1*c.wheelDeltaX/120),d.unshift(b,e,g,h),(a.event.dispatch||a.event.handle).apply(this,d)}var b=["DOMMouseScroll","mousewheel"];if(a.event.fixHooks)for(var c=b.length;c;)a.event.fixHooks[b[--c]]=a.event.mouseHooks;a.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=b.length;a;)this.addEventListener(b[--a],d,!1);else this.onmousewheel=d},teardown:function(){if(this.remove_eventListener)for(var a=b.length;a;)this.remove_eventListener(b[--a],d,!1);else this.onmousewheel=null}},a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery);

//.......

var ani_smooth;var zoom_speed;var pan_speed;function setSmooth(a){a=(((a-108)/100)*10)+1;a>10?a=10:"";a<1?a=1:"";zoomer_.ani_smooth=Math.max(1.5,a-1);return a}function setSpeed(a){a=(((a-108)/100)*10)+1;a>10?a=10:"";a<1?a=1:"";zoomer_.zoom_speed=1+((a+1)/20);zoomer_.pan_speed=((sW+sH)/500)-1+(a*a/4)+2;return a}function setLable(c,b,a,e){sW=a;sH=e;var d=String(parseInt(b*10)/10);d.length<2?d=d+".0":"";c.html(d)}jQuery(function(c){var h=c(document);var j=c("#cont");var f=c("#settings");f.addClass("noSel");var a=c("#barSmooth").css({left:smPos+"px"});var e=c("#barSmooth_t").css({left:smPos-3+"px","-moz-user-select":"none","-khtml-user-select":"none","-webkit-user-select":"none","user-select":"none",cursor:"default"}).addClass("noSel").hide();var i=false;a.bind("mouseover",function(k){a.css("background-position","-1025px 0px");if(!g){e.show()}}).bind("mouseout",function(k){if(!i){a.css("background-position","-1011px 0px"),e.hide()}}).bind("mousedown",function(l){i=true;e.show();a.css("background-position","-1025px 0px");offX=l.pageX-f.offset().left-a.position().left;h.bind("mousemove.preview",function(o){var m=o.pageX-f.offset().left-offX;m<112?m=108:"";m>194?m=198:"";m>148&&m<158?m=153:"";a.css({left:m+"px"});e.css({left:m-3+"px"});var n=setSmooth(a.position().left);setLable(e,n);return false});var k=setSmooth(a.position().left);setLable(e,k);l.stopPropagation();(c.browser.msie||l.preventDefault())}).addClass("noSel");a.bind("touchstart.preview",function(l){l.preventDefault();offX=l.originalEvent.changedTouches[0].pageX-f.offset().left-a.position().left;i=true;var k=setSmooth(a.position().left);setLable(e,k);a.css("background-position","-1025px 0px");e.show()});var d=c("#barSpeed").css({left:spPos+"px"});var b=c("#barSpeed_t").css({left:spPos-3+"px","-moz-user-select":"none","-khtml-user-select":"none","-webkit-user-select":"none","user-select":"none",cursor:"default"}).addClass("noSel").hide();var g=false;d.bind("mouseover",function(k){d.css("background-position","-1025px 0px");if(!i){b.show()}}).bind("mouseout",function(k){if(!g){d.css("background-position","-1011px 0px"),b.hide()}}).bind("mousedown",function(l){g=true;b.show();d.css("background-position","-1025px 0px");offX=l.pageX-f.offset().left-d.position().left;h.bind("mousemove.preview",function(o){var m=o.pageX-f.offset().left-offX;m<112?m=108:"";m>194?m=198:"";m>148&&m<158?m=153:"";d.css({left:m+"px"});b.css({left:m-3+"px"});var n=setSpeed(d.position().left);setLable(b,n);return false});var k=setSpeed(d.position().left);setLable(b,k);l.stopPropagation();(c.browser.msie||l.preventDefault())}).addClass("noSel");d.bind("touchstart.preview",function(l){l.preventDefault();offX=l.originalEvent.changedTouches[0].pageX-f.offset().left-d.position().left;g=true;var k=setSmooth(d.position().left);setLable(b,k);d.css("background-position","-1011px 0px");b.show()});h.bind("mouseup.preview",function(m){if(i){i=false;e.hide();h.unbind("mousemove.preview");var k=m.pageX-f.offset().left-offX;k<112?k=108:"";k>194?k=198:"";k>148&&k<158?k=153:"";a.css({left:k+"px"});e.css({left:k-3+"px"});l=setSmooth(a.position().left);setLable(e,l);a.css("background-position","-1011px 0px")}if(g){g=false;b.hide();h.unbind("mousemove.preview");var k=m.pageX-f.offset().left-offX;k<112?k=108:"";k>194?k=198:"";k>148&&k<158?k=153:"";d.css({left:k+"px"});b.css({left:k-3+"px"});var l=setSpeed(d.position().left);setLable(b,l);d.css("background-position","-1011px 0px")}});j.bind("touchmove.preview",function(m){m.preventDefault();if(i){var k=m.originalEvent.changedTouches[0].pageX-f.offset().left-offX;k<112?k=108:"";k>194?k=198:"";k>148&&k<158?k=153:"";a.css({left:k+"px"});e.css({left:k-3+"px"});var l=setSmooth(a.position().left);setLable(e,l)}if(g){var k=m.originalEvent.changedTouches[0].pageX-f.offset().left-offX;k<112?k=108:"";k>194?k=198:"";k>148&&k<158?k=153:"";d.css({left:k+"px"});b.css({left:k-3+"px"});var l=setSpeed(d.position().left);setLable(b,l)}});j.bind("touchend.preview",function(k){k.preventDefault();if(i){i=false;e.hide();setSmooth(((a.position().left-108)/100)*10);a.css("background-position","-1011px 0px")}if(g){g=false;b.hide();setSpeed(((d.position().left-108)/100)*10);d.css("background-position","-1011px 0px")}});c("#cont").addClass("noSel");c(".noSel").each(function(){this.onselectstart=function(){return false}});c("#s"+sample).css({"background-position":((sample-1)*-111)+"px -44px",cursor:"pointer"});c("#s1").bind("mouseover",function(k){if(sample!==1){c(this).css({"background-position":"0px -22px",cursor:"pointer"})}}).bind("mouseout",function(k){if(sample!==1){c(this).css({"background-position":"0px 0px",cursor:"default"})}}).bind("click",function(k){if(sample!==1){c(this).css("background-position","0px -44px"),c("#s2").css("background-position","-111px 0px"),c("#s3").css("background-position","-222px 0px"),c("#s4").css("background-position","-333px 0px"),c("#s5").css("background-position","-444px 0px"),c("#s6").css("background-position","-555px 0px"),c("#s7").css("background-position","-666px 0px"),sample=1}});c("#s2").bind("mouseover",function(k){if(sample!==2){c(this).css({"background-position":"-111px -22px",cursor:"pointer"})}}).bind("mouseout",function(k){if(sample!==2){c(this).css({"background-position":"-111px 0px",cursor:"default"})}}).bind("click",function(k){if(sample!==2){c(this).css("background-position","-111px -44px"),c("#s1").css("background-position","0px 0px"),c("#s3").css("background-position","-222px 0px"),c("#s4").css("background-position","-333px 0px"),c("#s5").css("background-position","-444px 0px"),c("#s6").css("background-position","-555px 0px"),c("#s7").css("background-position","-666px 0px"),sample=2}});c("#s3").bind("mouseover",function(k){if(sample!==3){c(this).css({"background-position":"-222px -22px",cursor:"pointer"})}}).bind("mouseout",function(k){if(sample!==3){c(this).css({"background-position":"-222px 0px",cursor:"default"})}}).bind("click",function(k){if(sample!==3){c(this).css("background-position","-222px -44px"),c("#s1").css("background-position","0px 0px"),c("#s2").css("background-position","-111px 0px"),c("#s4").css("background-position","-333px 0px"),c("#s5").css("background-position","-444px 0px"),c("#s6").css("background-position","-555px 0px"),c("#s7").css("background-position","-666px 0px"),sample=3}});c("#s4").bind("mouseover",function(k){if(sample!==4){c(this).css({"background-position":"-333px -22px",cursor:"pointer"})}}).bind("mouseout",function(k){if(sample!==4){c(this).css({"background-position":"-333px 0px",cursor:"default"})}}).bind("click",function(k){if(sample!==4){c(this).css("background-position","-333px -44px"),c("#s1").css("background-position","0px 0px"),c("#s2").css("background-position","-111px 0px"),c("#s3").css("background-position","-222px 0px"),c("#s5").css("background-position","-444px 0px"),c("#s6").css("background-position","-555px 0px"),c("#s7").css("background-position","-666px 0px"),sample=4}});c("#s5").bind("mouseover",function(k){if(sample!==5){c(this).css({"background-position":"-444px -22px",cursor:"pointer"})}}).bind("mouseout",function(k){if(sample!==5){c(this).css({"background-position":"-444px 0px",cursor:"default"})}}).bind("click",function(k){if(sample!==5){c(this).css("background-position","-444px -44px"),c("#s1").css("background-position","0px 0px"),c("#s2").css("background-position","-111px 0px"),c("#s3").css("background-position","-222px 0px"),c("#s4").css("background-position","-333px 0px"),c("#s6").css("background-position","-555px 0px"),c("#s7").css("background-position","-666px 0px"),sample=5}});c("#s6").bind("mouseover",function(k){if(sample!==6){c(this).css({"background-position":"-555px -22px",cursor:"pointer"})}}).bind("mouseout",function(k){if(sample!==6){c(this).css({"background-position":"-555px 0px",cursor:"default"})}}).bind("click",function(k){if(sample!==6){c(this).css("background-position","-555px -44px"),c("#s1").css("background-position","0px 0px"),c("#s2").css("background-position","-111px 0px"),c("#s3").css("background-position","-222px 0px"),c("#s4").css("background-position","-333px 0px"),c("#s5").css("background-position","-444px 0px"),c("#s7").css("background-position","-666px 0px"),sample=6}});c("#s7").bind("mouseover",function(k){if(sample!==7){c(this).css({"background-position":"-666px -22px",cursor:"pointer"})}}).bind("mouseout",function(k){if(sample!==7){c(this).css({"background-position":"-666px 0px",cursor:"default"})}}).bind("click",function(k){if(sample!==7){c(this).css("background-position","-666px -44px"),c("#s1").css("background-position","0px 0px"),c("#s2").css("background-position","-111px 0px"),c("#s3").css("background-position","-222px 0px"),c("#s4").css("background-position","-333px 0px"),c("#s5").css("background-position","-444px 0px"),c("#s6").css("background-position","-555px 0px"),sample=7}})});


