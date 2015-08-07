require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"js-2dmath":[function(require,module,exports){
module.exports=require('Focm2+');
},{}],"Focm2+":[function(require,module,exports){
require("./lib/math.js");

module.exports = {
    Vec2: require("./lib/vec2.js"),
    Line2: require("./lib/line2.js"),
    Segment2: require("./lib/segment2.js"),
    //geom
    Rectangle: require("./lib/rectangle.js"),
    AABB2: require("./lib/aabb2.js"),
    Circle: require("./lib/circle.js"),
    Triangle: require("./lib/triangle.js"),
    Polygon: require("./lib/polygon.js"),

    Beizer: require("./lib/beizer.js"),
    Matrix23: require("./lib/matrix23.js"),
    Matrix22: require("./lib/matrix22.js"),
    Collide: require("./lib/collide.js"),
    Intersection: require("./lib/intersection.js"),
    Transitions: require("./lib/transitions.js"),
    Xorshift: require("./lib/xorshift.js"),
    Noise: require("./lib/noise.js"),
    Draw: require("./lib/draw.js"),

    NMtree: require("./lib/nmtree.js"),

    Collision : {
        Response: require("./lib/collision/response.js"),
        GJK: require("./lib/collision/gjk.js"),
        EPA: require("./lib/collision/epa.js"),
        Manifold: require("./lib/collision/manifold.js"),
        SAT: require("./lib/collision/sat.js"),
        Resolve: require("./lib/collision/resolve.js")
    },

    NumericalIntegration: {
        RK4: require("./lib/numerical-integration/rk4.js"),
        Verlet: require("./lib/numerical-integration/verlet.js"),
        Euler: require("./lib/numerical-integration/euler.js")
    }
};

module.exports.globalize = function (object) {
    var i;
    for (i in module.exports) {
        if ("globalize" !== i) {
            object[i] = module.exports[i];
        }
    }
};


},{"./lib/aabb2.js":3,"./lib/beizer.js":4,"./lib/circle.js":5,"./lib/collide.js":6,"./lib/collision/epa.js":7,"./lib/collision/gjk.js":8,"./lib/collision/manifold.js":9,"./lib/collision/resolve.js":10,"./lib/collision/response.js":11,"./lib/collision/sat.js":12,"./lib/draw.js":14,"./lib/intersection.js":15,"./lib/line2.js":16,"./lib/math.js":17,"./lib/matrix22.js":18,"./lib/matrix23.js":19,"./lib/nmtree.js":20,"./lib/noise.js":21,"./lib/numerical-integration/euler.js":22,"./lib/numerical-integration/rk4.js":23,"./lib/numerical-integration/verlet.js":24,"./lib/polygon.js":25,"./lib/rectangle.js":26,"./lib/segment2.js":27,"./lib/transitions.js":28,"./lib/triangle.js":29,"./lib/vec2.js":30,"./lib/xorshift.js":31}],3:[function(require,module,exports){
/**
 * Stability: 1 (Only additions & fixes)
 *
 * BoundingBox2 is represented as a 5 coordinates array
 * [left: Number, bottom: Number, right: Number, top: Number, normalized: Boolean]
 */

var min = Math.min,
    max = Math.max,
    TOPLEFT = 1,
    TOPMIDDLE = 2,
    TOPRIGHT = 3,

    CENTERLEFT = 4,
    CENTER = 5,
    CENTERRIGHT = 6,

    BOTTOMLEFT = 7,
    BOTTOM = 8,
    BOTTOMRIGHT = 9,

    r = 0,
    x = 0,
    y = 0,

    min_x = 0,
    max_x = 0,
    min_y = 0,
    max_y = 0;

/**
 * @param {Number} l
 * @param {Number} b
 * @param {Number} r
 * @param {Number} t
 * @return {AABB2}
 */
function create(l, b, r, t) {
    var out = [l, b, r, t, false];
    normalize(out, out);
    return out;
}
/**
 * @param {AABB2} aabb2
 * @param {Number} x
 * @param {Number} y
 * @return {Array<AABB2>}
 */
function fromAABB2Division(aabb2, x, y) {
    var out = [],
        i,
        j,
        l = aabb2[0],
        b = aabb2[1],
        r = aabb2[2],
        t = aabb2[3],
        w = (r - l) / x,
        h = (t - b) / y;

    for (i = 0; i < x; ++i) {
        for (j = 0; j < y; ++j) {
            out.push([l + i * w, b + j * h, l + (i + 1) * w, b + (j + 1) * h]);
        }
    }

    return out;
}
/**
 * @param {Segment2} seg2
 * @return {AABB2}
 */
function fromSegment2(seg2) {
    var out = [seg2[0], seg2[1], seg2[2], seg2[3], false];
    normalize(out, out);
    return out;
}
/**
 * @param {Circle} circle
 * @return {AABB2}
 */
function fromCircle(circle) {
    r = circle[1];
    x = circle[0][0];
    y = circle[0][1];
    return create(
        x - r,
        y - r,
        x + r,
        y + r
    );
}
/**
 * @param {Rectangle} rect
 * @return {AABB2}
 */
function fromRectangle(rect) {
    var out = [rect[0][0], rect[0][1], rect[1][0], rect[1][1], false];
    normalize(out, out);
    return out;
}
/**
 * @todo implement a more robust / fast algorithm http://stackoverflow.com/questions/2587751/an-algorithm-to-find-bounding-box-of-closed-bezier-curves (Timo answer)
 *
 * @reference http://jsfiddle.net/4VCVX/3/
 *
 * @param {Beizer} beizer
 * @param {Number} npoints
 * @return {AABB2}
 */
function fromBeizer(beizer, npoints) {
    npoints = npoints || 40;
    var vec2_list = Beizer.get(beizer, npoints),
        i,
        l = Infinity,
        b = Infinity,
        r = -Infinity,
        t = -Infinity,
        v,
        x,
        y;

    // loop min, max
    for (i = 0; i < npoints; ++i) {
        v = vec2_list[i];

        x = v[0];
        y = v[1];

        if (x > r) {
            r = x;
        } else if (x < l) {
            l = x;
        }

        if (y < b) {
            b = y;
        } else if (y > t) {
            t = y;
        }
    }

    return [l, b, r, t, true];

}

/**
 * @return {AABB2}
 */
function zero() {
    return [0, 0, 0, 0, true];
}
/**
 * @param {AABB2} aabb2
 * @return {AABB2}
 */
function clone(aabb2) {
    return [aabb2[0], aabb2[1], aabb2[2], aabb2[3], aabb2[4]];
}
/**
 * @param {AABB2} out
 * @param {AABB2} aabb2
 * @return {AABB2}
 */
function copy(out, aabb2) {
    out[0] = aabb2[0];
    out[1] = aabb2[1];
    out[2] = aabb2[2];
    out[3] = aabb2[3];
    out[4] = aabb2[4];

    return out;
}
/**
 * @param {AABB2} out
 * @param {AABB2} aabb2
 * @param {Number} margin
 * @return {AABB2}
 */
function expand(out, aabb2, margin) {
    out[0] = aabb2[0] - margin;
    out[1] = aabb2[1] - margin;
    out[2] = aabb2[2] + margin;
    out[3] = aabb2[3] + margin;

    return out;
}
/**
 * @param {AABB2} out
 * @param {AABB2} aabb2_1
 * @param {AABB2} aabb2_2
 * @return {AABB2}
 */
function merge(out, aabb2_1, aabb2_2) {
    out[0] = min(aabb2_1[0], aabb2_2[0]);
    out[1] = min(aabb2_1[1], aabb2_2[1]);
    out[2] = max(aabb2_1[2], aabb2_2[2]);
    out[3] = max(aabb2_1[3], aabb2_2[3]);

    return out;
}
/**
 * @param {AABB2} out
 * @param {AABB2} aabb2_1
 * @param {AABB2} aabb2_2
 * @param {Vec2} vec2_offset
 * @return {AABB2}
 */
function offsetMerge(out, aabb2_1, aabb2_2, vec2_offset) {
    out[0] = min(aabb2_1[0], aabb2_2[0] + vec2_offset[0]);
    out[1] = min(aabb2_1[1], aabb2_2[1] + vec2_offset[1]);
    out[2] = max(aabb2_1[2], aabb2_2[2] + vec2_offset[0]);
    out[3] = max(aabb2_1[3], aabb2_2[3] + vec2_offset[1]);

    return out;
}
/**
 * offset & scale merge
 * @param {AABB2} out
 * @param {AABB2} aabb2_1
 * @param {AABB2} aabb2_2
 * @param {Vec2} vec2_offset
 * @param {Vec2} vec2_scale
 * @return {AABB2}
 */
function osMerge(out, aabb2_1, aabb2_2, vec2_offset, vec2_scale) {
    out[0] = min(aabb2_1[0], (aabb2_2[0] * vec2_scale[0]) + vec2_offset[0]);
    out[1] = min(aabb2_1[1], (aabb2_2[1] * vec2_scale[1]) + vec2_offset[1]);
    out[2] = max(aabb2_1[2], (aabb2_2[2] * vec2_scale[0]) + vec2_offset[0]);
    out[3] = max(aabb2_1[3], (aabb2_2[3] * vec2_scale[1]) + vec2_offset[1]);

    return out;
}
/**
 * offset & scale merge
 * @param {AABB2} aabb2
 * @return {Number}
 */
function area(aabb2) {
    return (aabb2[2] - aabb2[0]) * (aabb2[3] - aabb2[1]);
}
/**
 * @param {AABB2} out
 * @param {AABB2} aabb2
 * @return {AABB2}
 */
function normalize(out, aabb2) {
    min_x = aabb2[0] > aabb2[2] ? aabb2[2] : aabb2[0];
    max_x = aabb2[0] > aabb2[2] ? aabb2[0] : aabb2[2];
    min_y = aabb2[1] > aabb2[3] ? aabb2[3] : aabb2[1];
    max_y = aabb2[1] > aabb2[3] ? aabb2[1] : aabb2[3];

    out[0] = min_x;
    out[1] = min_y;

    out[2] = max_x;
    out[3] = max_y;

    out[4] = true;

}
/**
 * @param {AABB2} out
 * @param {AABB2} aabb2
 * @param {Vec2} vec2
 * @return {AABB2}
 */
function translate(out, aabb2, vec2) {
    x = vec2[0];
    y = vec2[1];

    out[0] = aabb2[0] + x;
    out[1] = aabb2[1] + y;
    out[2] = aabb2[2] + x;
    out[3] = aabb2[3] + y;

    return out;
}
/**
 * @param {Vec2} out_vec2
 * @param {AABB2} aabb2
 * @param {Vec2} vec2
 * @return {Vec2}
 */
function clampVec(out_vec2, aabb2, vec2) {
    out_vec2[0] = min(max(aabb2[0], vec2[0]), aabb2[2]);
    out_vec2[1] = min(max(aabb2[1], vec2[1]), aabb2[3]);

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {AABB2} aabb2
 */
function center(out_vec2, aabb2) {
    out_vec2[0] = (aabb2[0] + aabb2[1]) * 0.5;
    out_vec2[1] = (aabb2[3] + aabb2[2]) * 0.5;

    return out_vec2;
}

/**
 * alignment values: AABB2.TOPLEFT, AABB2.TOPMIDDLE, AABB2.TOPRIGHT, AABB2.CENTERLEFT, AABB2.CENTER, AABB2.CENTERRIGHT, AABB2.BOTTOMLEFT, AABB2.BOTTOM, AABB2.BOTTOMRIGH
 *
 * @param {Vec2} out_vec2
 * @param {AABB2} aabb2
 * @param {Number} alignment
 * @return {Vec2}
 */
function align(out_vec2, aabb2, alignment) {
    switch (alignment) {
    case TOPLEFT:
        // do nothing!
        out_vec2[0] = aabb2[0];
        out_vec2[1] = aabb2[1];
        break;
    case TOPMIDDLE:
        out_vec2[0] = (aabb2[2] - aabb2[0]) * 0.5 + aabb2[0];
        out_vec2[1] = aabb2[1];
        break;
    case TOPRIGHT:
        out_vec2[0] = aabb2[2];
        out_vec2[1] = aabb2[1];
        break;

    case CENTERLEFT:
        out_vec2[0] = aabb2[0];
        out_vec2[1] = (aabb2[3] - aabb2[1]) * 0.5 + aabb2[1];
        break;
    case CENTER:
        out_vec2[0] = (aabb2[2] - aabb2[0]) * 0.5 + aabb2[0];
        out_vec2[1] = (aabb2[3] - aabb2[1]) * 0.5 + aabb2[1];
        break;
    case CENTERRIGHT:
        out_vec2[0] = aabb2[2];
        out_vec2[1] = (aabb2[3] - aabb2[1]) * 0.5 + aabb2[1];
        break;

    case BOTTOMLEFT:
        out_vec2[0] = aabb2[0];
        out_vec2[1] = aabb2[3];
        break;
    case BOTTOM:
        out_vec2[0] = (aabb2[2] - aabb2[0]) * 0.5 + aabb2[0];
        out_vec2[1] = aabb2[3];
        break;
    case BOTTOMRIGHT:
        out_vec2[0] = aabb2[2];
        out_vec2[1] = aabb2[3];
        break;
    }

    return out_vec2;
}
/**
 * @param {AABB2} aabb2
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function isVec2Inside(aabb2, vec2) {
    return aabb2[0] < vec2[0] && aabb2[2] > vec2[0] && aabb2[1] < vec2[1] && aabb2[3] > vec2[1];
}
/**
 * @param {AABB2} aabb2
 * @param {AABB2} aabb2_2
 * @return {Boolean}
 */
function isAABB2Inside(aabb2, aabb2_2) {
    return aabb2[0] <= aabb2_2[0] &&
        aabb2[1] <= aabb2_2[1] &&
        aabb2_2[2] <= aabb2[2] &&
        aabb2_2[3] <= aabb2[3];
}
/**
 * @param {AABB2} aabb2
 * @return {Number}
 */
function perimeter(aabb2) {
    return (aabb2[2] - aabb2[0]) * 2 + (aabb2[3] - aabb2[1]) * 2;
}

/**
 * @class AABB2
 */
var AABB2 =  {
    // defines
    TOPLEFT: TOPLEFT,
    TOPMIDDLE: TOPMIDDLE,
    TOPRIGHT: TOPRIGHT,
    CENTERLEFT: CENTERLEFT,
    CENTER: CENTER,
    CENTERRIGHT: CENTERRIGHT,
    BOTTOMLEFT: BOTTOMLEFT,
    BOTTOM: BOTTOM,
    BOTTOMRIGHT: BOTTOMRIGHT,

    create: create,
    fromAABB2Division: fromAABB2Division,
    fromSegment2: fromSegment2,
    fromCircle: fromCircle,
    fromRectangle: fromRectangle,
    zero: zero,
    clone: clone,
    copy: copy,
    expand: expand,
    merge: merge,
    offsetMerge: offsetMerge,
    osMerge: osMerge,
    area: area,
    normalize: normalize,
    translate: translate,
    clampVec: clampVec,
    center: center,
    align: align,
    isVec2Inside: isVec2Inside,
    isAABB2Inside: isAABB2Inside,
    perimeter: perimeter,

    // alias
    contains: isAABB2Inside
};

module.exports = AABB2;
},{}],4:[function(require,module,exports){
/**
 * Stability: 1 (Only additions & fixes)
 *
 * @reference http://pomax.github.io/bezierinfo/
 * @reference https://github.com/jackcviers/Degrafa/blob/master/Degrafa/com/degrafa/geometry/utilities/BezierUtils.as
 * @reference http://cagd.cs.byu.edu/~557/text/ch7.pdf
 * @reference http://algorithmist.wordpress.com/2009/02/02/degrafa-closest-point-on-quad-bezier/
 * @reference http://algorithmist.wordpress.com/2009/01/26/degrafa-bezierutils-class/
*/
var sqrt = Math.sqrt,
    cl0 = 0,
    cl1 = 0,
    cl2 = 0,
    cl3 = 0,
    t1 = 0,
    t2 = 0,
    t3 = 0;

/**
 * cp0 - start point
 * cp1 - start control point
 * cp2 - end control point
 * cp3 - end point
 *
 * @param {Number} cp0x
 * @param {Number} cp0y
 * @param {Number} cp1x
 * @param {Number} cp1y
 * @param {Number} cp2x
 * @param {Number} cp2y
 * @param {Number} cp3x
 * @param {Number} cp3y
 * @return {Beizer}
 */
function cubic(cp0x, cp0y, cp1x, cp1y, cp2x, cp2y, cp3x, cp3y) {
    return [[cp0x, cp0y], [cp1x, cp1y], [cp2x, cp2y], [cp3x, cp3y]];
}
/**
 * For implementation see Figure 21.2
 * @reference http://pomax.github.io/bezierinfo/
 * @todo DO IT!
 *
 * @param {Number} cp0x
 * @param {Number} cp0y
 * @param {Number} cp1x
 * @param {Number} cp1y
 * @param {Number} cp2x
 * @param {Number} cp2y
 * @return {Beizer}
 */
function from3Points(cp0x, cp0y, cp1x, cp1y, cp2x, cp2y) {
}
/**
 * @param {Number} cp0x
 * @param {Number} cp0y
 * @param {Number} cp1x
 * @param {Number} cp1y
 * @param {Number} cp2x
 * @param {Number} cp2y
 * @return {Beizer}
 */
function quadric(cp0x, cp0y, cp1x, cp1y, cp2x, cp2y) {
    return [[cp0x, cp0y], [cp1x, cp1y], [cp2x, cp2y]];
}
/**
 * For implementation see Figure 21.1
 * @reference http://pomax.github.io/bezierinfo/
 * @param {Number} cp0x
 * @param {Number} cp0y
 * @param {Number} cp1x
 * @param {Number} cp1y
 * @param {Number} cp2x
 * @param {Number} cp2y
 */
function quadricFrom3Points(cp0x, cp0y, cp1x, cp1y, cp2x, cp2y) {

}
/**
 * Solves the curve (quadric or cubic) for any given parameter t.
 * @source https://github.com/hyperandroid/CAAT/blob/master/src/Math/Bezier.js
 * @param {Vec2} out_vec2
 * @param {Beizer} curve
 * @param {Number} t [0-1]
 * @return {Vec2}
 */
function solve(out_vec2, curve, t) {
    if (curve.length === 4) {
        //cubic
        t2 = t * t;
        t3 = t * t2;
        cl0 = curve[0];
        cl1 = curve[1];
        cl2 = curve[2];
        cl3 = curve[3];

        out_vec2[0] = (cl0[0] + t * (-cl0[0] * 3 + t * (3 * cl0[0] - cl0[0] * t))) +
                   t * (3 * cl1[0] + t * (-6 * cl1[0] + cl1[0] * 3 * t)) +
                   t2 * (cl2[0] * 3 - cl2[0] * 3 * t) +
                   cl3[0] * t3;
        out_vec2[1] = (cl0[1] + t * (-cl0[1] * 3 + t * (3 * cl0[1] - cl0[1] * t))) +
                   t * (3 * cl1[1] + t * (-6 * cl1[1] + cl1[1] * 3 * t)) +
                   t2 * (cl2[1] * 3 - cl2[1] * 3 * t) +
                   cl3[1] * t3;
    } else {
        // quadric

        cl0 = curve[0];
        cl1 = curve[1];
        cl2 = curve[2];
        t1 = 1 - t;

        out_vec2[0] = t1 * t1 * cl0[0] + 2 * t1 * t * cl1[0] + t * t * cl2[0];
        out_vec2[1] = t1 * t1 * cl0[1] + 2 * t1 * t * cl1[1] + t * t * cl2[1];
    }

    return out_vec2;
}
/**
 * Solve the curve npoints times and return the solution array.
 *
 * @see Polygon.fromBeizer
 *
 * @param {Beizer} curve
 * @param {Number} npoints
 * @return {Vec2[]}
 */
function getPoints(curve, npoints) {
    var inv_npoints = 1 / npoints,
        i,
        output = [],
        vec2;

    for (i = 0; i <= 1; i += inv_npoints) {
        vec2 = [0, 0];
        output.push(solve(vec2, curve, i));
    }

    return output;
}
/**
 * Calculate the curve length by incrementally solving the curve every substep=CAAT.Curve.k. This value defaults
 * to .05 so at least 20 iterations will be performed.
 * @todo some kind of cache maybe it's needed!
 * @param {Beizer} curve
 * @param {Number} step
 * @return {Number} the approximate curve length.
 */
function length(curve, step) {
    step = step || 0.05;

    var x1,
        y1,
        llength = 0,
        pt = [0, 0],
        t;

    x1 = curve[0][0];
    y1 = curve[0][1];
    for (t = step; t <= 1 + step; t += step) {
        solve(pt, curve, t);
        llength += sqrt((pt[0] - x1) * (pt[0] - x1) + (pt[1] - y1) * (pt[1] - y1));
        x1 = pt[0];
        y1 = pt[1];
    }

    return llength;
}

/**
 * credits - CAAT
 *
 * @class Beizer
 */
var Beizer = {
    cubic: cubic,
    quadric: quadric,
    solve: solve,
    length: length,
    getPoints: getPoints
};


module.exports = Beizer;
},{}],5:[function(require,module,exports){
/**
 * Stability: 1 (Only additions & fixes)
 *
 * Circle is represented as a two coordinates array
 * [c:Vec2, r:Number]
 */

var Vec2 = require("./vec2.js"),
    vec2_sub = Vec2.sub,
    vec2_distance = Vec2.distance,
    vec2_distance_sq = Vec2.distanceSq,
    vec2_midpoint = Vec2.midPoint,

    Rectangle = require("./rectangle.js"),
    rectangle_center = Rectangle.center,

    Triangle = require("./triangle.js"),
    triangle_circumcenter = Triangle.circumcenter,
    triangle_center = Triangle.center,
    triangle_abmidpoint = Triangle.abMidPoint,
    triangle_bcmidpoint = Triangle.bcMidPoint,
    triangle_camidpoint = Triangle.caMidPoint,

    max = Math.max,
    TWOPI = Math.TWOPI,
    QUATER_PI = Math.PI * 0.25,
    PI = Math.PI,
    sqrt = Math.sqrt,
    aux_vec2 = [0, 0],
    aux_num,
    aux_num2;
/**
 * @param {Number} x
 * @param {Number} y
 * @param {Number} radius
 * @return {Circle}
 */
function create(x, y, radius) {
    return [[x, y], radius];
}
/**
 * @param {Vec2} vec2
 * @param {Number} radius
 * @return {Circle}
 */
function fromVec2(vec2, radius) {
    return [[vec2[0], vec2[1]], radius];
}
/**
 * Create a Circle with seg2 as diameter
 *
 * @param {Segment2} seg2
 * @return {Circle}
 */
function fromSegment2(seg2) {
    var out = [[0, 0], 0];

    out[0][0] = (seg2[0] + seg2[2]) * 0.5;
    out[0][1] = (seg2[1] + seg2[3]) * 0.5;

    //subtract
    aux_num = out[0][0] - seg2[0];
    aux_num2 = out[0][1] - seg2[1];
    //sqrLength
    out[1] = sqrt(aux_num * aux_num + aux_num2 * aux_num2);

    return out;
}
/**
 * @param {Rectangle} rect
 * @param {Boolean=} inside
 * @return {Circle}
 */
function fromRectangle(rect, inside) {
    var out = [[0, 0], 0];
    rectangle_center(out[0], rect);

    if (inside) {
        aux_vec2[0] = rect[0][0] + (rect[1][0] - rect[0][0]) * 0.5;
        aux_vec2[1] = rect[0][1];

        out[1] = vec2_distance(out[0], aux_vec2);
    } else {
        out[1] = vec2_distance(out[0], rect[0]);
    }

    return out;
}
/**
 * @todo review inside cases
 * @param {Triangle} tri
 * @param {Boolean=} inside
 * @param {Boolean=} circumcenter
 * @return {Circle}
 */
function fromTriangle(tri, inside, circumcenter) {
    var out = [[0, 0], 0];

    if (circumcenter && !inside) {
        triangle_circumcenter(out[0], tri);

        // use distance^2 for comparison
        out[1] = vec2_distance_sq(out[0], tri[0]);
        aux_num = vec2_distance_sq(out[0], tri[1]);
        if (aux_num > out[1]) {
            out[1] = aux_num;
        }
        out[1] = vec2_distance_sq(out[0], tri[2]);
        if (aux_num > out[1]) {
            out[1] = aux_num;
        }
        // and now return the good one :)
        out[1] = sqrt(out[1]);

        return out;
    }

    triangle_center(out[0], tri);

    // use distance^2 for comparison
    triangle_abmidpoint(aux_vec2, tri);
    out[1] = vec2_distance_sq(out[0], aux_vec2);

    triangle_bcmidpoint(aux_vec2, tri);
    aux_num = vec2_distance_sq(out[0], aux_vec2);
    if (aux_num < out[1]) {
        out[1] = aux_num;
    }

    triangle_camidpoint(aux_vec2, tri);
    aux_num = vec2_distance_sq(out[0], aux_vec2);
    if (aux_num < out[1]) {
        out[1] = aux_num;
    }

    // and now return the good one :)
    out[1] = sqrt(out[1]);

    return out;
}

/**
 * @param {Circle} circle
 * @return {Circle}
 */
function clone(circle) {
    return [[circle[0][0], circle[0][1]], circle[1]];
}
/**
 * @param {Circle} out
 * @param {Circle} circle
 * @return {Circle}
 */
function copy(out, circle) {
    out[0][0] = circle[0][0];
    out[0][1] = circle[0][1];
    out[1] = circle[1];

    return out;
}
/**
 * @param {Circle} out
 * @param {Circle} circle
 * @param {Vec2} vec2
 * @return {Circle}
 */
function translate(out, circle, vec2) {
    out[0][0] = circle[0][0] + vec2[0];
    out[0][1] = circle[0][1] + vec2[1];
    out[1] = circle[1];

    return out;
}
/**
 * @param {Circle} out
 * @param {Circle} circle
 * @param {Vec2} vec2
 * @return {Circle}
 */
function moveTo(out, circle, vec2) {
    out[0][0] = vec2[0];
    out[0][1] = vec2[1];
    out[1] = circle[1];

    return out;
}
/**
 * @param {Circle} circle
 * @param {Circle} circle_2
 * @return {Number}
 */
function distance(circle, circle_2) {
    return max(0, vec2_distance(circle[0], circle_2[0]) - circle[1] - circle_2[1]);
}
/**
 * @param {Circle} circle
 * @return {Number}
 */
function length(circle) {
    return TWOPI * circle[1];
}
/**
 * @param {Circle} circle
 * @return {Number}
 */
function area(circle) {
    return PI * circle[1] * circle[1];
}
/**
 * @param {Circle} circle
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function isVec2Inside(circle, vec2) {
    return vec2_distance(circle[0], vec2) < circle[1];
}
/**
 * @param {Vec2} out_vec2
 * @param {Circle} circle
 * @param {Vec2} vec2
 * @return {Vec2}
 */
function closestPoint(out_vec2, circle, vec2) {
    //const Vector& P, const Vector& Centre, float radius, bool* inside)
    vec2_sub(out_vec2, vec2 - cirlce[0]);

    var dist2 = vec2_length(out_vec2);

    // is inside? (dist2 <= radius * radius);

    //if(dist2 > EPS) Delta /= sqrt(dist2);

    vec2_scale(out_vec2, out_vec2, scale);
    vec2_add(out_vec2, cirlce[0], scale);

    return out_vec2;
}

/**
 * @param {Circle} circle
 * @param {Number} mass
 */
function momentOfInertia(circle, mass) {
    var r = circle[1];
    return mass * r * r * 0.5;

}

/**
 * @class Circle
 */
var Circle = {
    create: create,
    fromVec2: fromVec2,
    fromSegment2: fromSegment2,
    fromRectangle: fromRectangle,
    fromTriangle: fromTriangle,
    clone: clone,
    copy: copy,
    translate: translate,
    moveTo: moveTo,
    distance: distance,
    length: length,
    area: area,
    isVec2Inside: isVec2Inside,

    //physics
    momentOfInertia: momentOfInertia,

    // alias
    perimeter: length,
    move: moveTo
};


module.exports = Circle;
},{"./rectangle.js":26,"./triangle.js":29,"./vec2.js":30}],6:[function(require,module,exports){
/**
 * Stability: 0 (Anything could happen)
 *
 * This need revision.
 * **inside:Boolean** param must be added to all functions
 * *Note** this not return the contact points, use intersections for that.
 *
 * @source http://members.gamedev.net/oliii/satpost/SpherePolygonCollision.cpp
 */

var Vec2 = require("./vec2.js"),
    vec2_distance = Vec2.distance,
    vec2_distance_sq = Vec2.distanceSq,
    vec2_midpoint = Vec2.midPoint,
    vec2_$near = Vec2.$near,
    vec2_sub = Vec2.sub,
    vec2_dot = Vec2.dot,

    Segment2 = require("./segment2.js"),
    Segment2_$closestPoint = Segment2.$closestPoint,

    aux_vec2 = [0, 0],
    ca = [0, 0],
    ba = [0, 0],
    pa = [0, 0],

    EPS = Math.EPS = 0.001;

/**
 * @param {Number} num
 * @param {Number} num2
 * @param {Number} dist
 */
function _near(num, num2, dist) {
    return num > num2 - dist && num < num2 + dist;
}

/**
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 */
function _rectangle_vec2(x1, y1, x2, y2, x3, y3) {
    return (x1 > x3 || x2 < x3 || y1 > y3 || y2 < y3) ? false : true;
}
/**
 * @param {AABB2} bb2
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function bb2_vec2(bb2, vec2) {
    return _rectangle_vec2(bb2[0], bb2[1], bb2[2], bb2[3], vec2[0], vec2[1]);
}
/**
 * @param {Vec2} vec2
 * @param {AABB2} bb2
 * @return {Boolean}
 */
function vec2_bb2(vec2, bb2) {
    return _rectangle_vec2(bb2[0], bb2[1], bb2[2], bb2[3], vec2[0], vec2[1]);
}
/**
 * @param {Rectangle} rect
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function rectangle_vec2(rect, vec2) {
    var tl = rect[0], br = rect[1];
    return _rectangle_vec2(tl[0], tl[1], br[0], br[1], vec2[0], vec2[1]);
}
/**
 * @param {Vec2} vec2
 * @param {Rectangle} rect
 * @return {Boolean}
 */
function vec2_rectangle(vec2, rect) {
    var tl = rect[0], br = rect[1];
    return _rectangle_vec2(tl[0], tl[1], br[0], br[1], vec2[0], vec2[1]);
}

/**
 * @param {Segment2} seg2
 * @param {Vec2} vec2
 * @benchmark
 * @return {Boolean}
 */
function segment2_vec2(seg2, vec2) {
    var x = vec2[0],
        y = vec2[1];

    Segment2_$closestPoint(aux_vec2, seg2[0], seg2[1], seg2[2], seg2[3], x, y);

    return vec2_$near(aux_vec2[0], aux_vec2[1], x, y);
}
/**
 * @param {Vec2} vec2
 * @param {Segment2} seg2
 * @return {Boolean}
 */
function vec2_segment2(vec2, seg2) {
    return segment2_vec2(seg2, vec2);
}
/**
 * @param {Vec2} vec2
 * @param {Line2} line2
 * @return {Boolean}
 */
function vec2_line2(vec2, line2) {
    //return _near(vec2[1], line2[1] * vec2[0] - line2[0][1]);
    var p = line2[0];
    return _near(line2[1], (vec2[1] - p[1]) / (vec2[0] - p[0]), EPS);
}

/**
 * @param {Line2} line2
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function line2_vec2(line2, vec2) {
    //return _near(vec2[1], line2[1] * vec2[0] - line2[0][1]);
    var p = line2[0];
    return _near(line2[1], (vec2[1] - p[1]) / (vec2[0] - p[0]), EPS);
}



/**
 * @param {Circle} circle_1
 * @param {Circle} circle_2
 * @return {Boolean}
 */
function circle_circle(circle_1, circle_2) {
    strict = strict || false;

    var // Determine minimum and maximum radius where circles can intersect
        r_max = circle_1[1] + circle_2[1],
        // Determine actual distance between circle circles
        c_dist_sq = Vec2.distanceSq(circle_1[0], circle_2[0]);

    if (c_dist_sq > r_max * r_max) {
        return false;
    }

    return true;
}

/**
 * @param {Circle} circle
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function circle_vec2(circle, vec2) {
    var distance_to_center = vec2_distance_sq(circle[0], vec2),
        r = circle[1],
        r2 = r * r;

    return distance_to_center <= r2;
}
/**
 * @param {Vec2} vec2
 * @param {Circle} circle
 * @return {Boolean}
 */
function vec2_circle(vec2, circle) {
    circle_vec2(circle, vec2);
}
/**
 * @param {Triangle} tri
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function triangle_vec2(tri, vec2) {
    // Compute vectors
    ca = vec2_sub(tri[2], tri[0]); // v0 = C - A
    ba = vec2_sub(tri[1], tri[0]); // v1 = B - A
    pa = vec2_sub(vec2, tri[0]); // v2 = P - A

    // Compute dot products
    var dot00 = vec2_dot(ca, ca); //dot00 = dot(v0, v0)
    var dot01 = vec2_dot(ca, ba); //dot01 = dot(v0, v1)
    var dot02 = vec2_dot(ca, pa); //dot02 = dot(v0, v2)
    var dot11 = vec2_dot(ba, ba); //dot11 = dot(v1, v1)
    var dot12 = vec2_dot(ba, pa); //dot12 = dot(v1, v2)

    // Compute barycentric coordinates
    var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    // Check if point is in triangle
    return (u >= 0) && (v >= 0) && (u + v < 1);

}
/**
 * @param {Vec2} vec2
 * @param {Triangle} tri
 * @return {Boolean}
 */
function vec2_triangle(vec2, tri) {
    return triangle_vec2(tri, vec2)
}

/**
 * @param {Vec2} vec2
 * @param {Vec2} vec2_2
 * @return {Boolean}
 */
function vec2_vec2(vec2, vec2_2) {
    return _near(vec2[0], vec2_2[0], EPS) &&
        _near(vec2[1], vec2_2[1], EPS);
}

var Collide = {
    circle_circle: circle_circle,

    //
    // vec2 against the world!
    //
    bb2_vec2: bb2_vec2,
    vec2_bb2: vec2_bb2,

    rectangle_vec2: rectangle_vec2,
    vec2_rectangle: vec2_rectangle,

    segment2_vec2: segment2_vec2,
    vec2_segment2: vec2_segment2,

    circle_vec2: circle_vec2,
    vec2_circle: vec2_circle,

    vec2_line2: vec2_line2,
    line2_vec2: line2_vec2,

    triangle_vec2: triangle_vec2,
    vec2_triangle: vec2_triangle,

    vec2_vec2: vec2_vec2,
};

module.exports = Collide;

/*
var primitives = ["circle", "rectangle", "vec2", "line2", "segment2", "bb2", "triangle"],
    i,
    j,
    fn;
for (i = 0; i < primitives.length; ++i) {
    for (j = 0; j < primitives.length; ++j) {
        fn = primitives[i] + "_" + primitives[j];
        if (!Collisions[fn]) {
            console.log("todo: Collisions.", fn);
        }
    }

}

console.log(vec2_line2([1, 1], [[0,0], 1]));
console.log(vec2_line2([1, 2], [[0,0], 2]));

*/
},{"./segment2.js":27,"./vec2.js":30}],7:[function(require,module,exports){
/**
 * @reference http://www.codezealot.org/archives/180
 * @reference https://github.com/LSFN/dyn4go/blob/383474ee3924d626a1c106bc717f07deb76b9635/collision/narrowphase/EPA.go
 * @reference https://github.com/BrandonLittell/PinballGL/blob/d2678f0e916cdb8b8a234243feeda03a196e5bc8/Group3_FinalProject/Collision.cpp
 */

var Vec2 = require("../vec2.js"),
    vec2_sub = Vec2.sub,
    vec2_cross = Vec2.cross,
    vec2_tripleProduct = Vec2.tripleProduct,
    vec2_normalize = Vec2.normalize,
    vec2_dot = Vec2.dot,
    Polygon = require("../polygon.js"),
    clear = require("./response.js").clear,
    polygon_furthestMinkowski = Polygon.furthestMinkowski;

var gw_aux = [0, 0];
var gw_aux2 = [0, 0];
/**
 * @param {Polygon} simplex
 * @return {Number}
 */
function _getWinding(simplex) {
    vec2_sub(gw_aux, simplex[1], simplex[0]);
    vec2_sub(gw_aux2, simplex[2], simplex[1]);
    return vec2_cross(gw_aux, gw_aux2);


    var len = simplex.length,
        i = 0,
        j,
        f;

    for (; i < len; ++i) {
        j = i + 1;
        if (j === len) {
            j = 0;
        }
        f = vec2_cross(simplex[i], simplex[j]);

        if (f > 0) {
            return 1;
        } else if (f < 0) {
            return -1;
        }
    }
    return 0;
}

var edge = [0, 0];
/**
 * @param {Polygon} simplex
 * @param {Number} winding
 */
function _findClosestEdge(simplex, winding) {
    // prime the distance of the edge to the max
    var distance = Infinity,
        a,
        i,
        j,
        d,
        n = [0, 0],
        normal = [0, 0],
        index,
        len = simplex.length,
        lenm1 = len - 1;

    // simplex is the passed in simplex
    for (i = 0; i < len; i++) {
        // compute the next points index
        j = i === lenm1 ? 0 : i + 1;
        // get the current point and the next one
        a = simplex[i];
        // b = simplex[j];
        // create the edge vector
        vec2_sub(edge, simplex[j], a); // or a.to(b);
        // console.log("edge", edge, "@", i, j, a, simplex[j]);
        // get the vector from the origin to a
        //Vector oa = a; // or a - ORIGIN

        // get the vector from the edge towards the origin
        //vec2_tripleProduct(n, edge, a, edge);
        //----------------------------------------------------------------------
        // @llafuente: winding method seems to be more reliable to find MTV
        if (winding > 0) {
            Vec2.rotateCW(n, edge);
        } else {
            Vec2.rotateCCW(n, edge);
        }
        // normalize the vector
        //----------------------------------------------------------------------

        vec2_normalize(n, n);
        // console.log("tripleProduct", n, edge, a, edge);
        // calculate the distance from the origin to the edge
        d = vec2_dot(a, n); // could use b or a here
        // check the distance against the other distances
        // console.log("d = a.dot(n) =", d, distance);
        if (d < distance) {
            // if this edge is closer then use it
            distance = d;
            normal[0] = n[0];
            normal[1] = n[1];
            index = j;
        }
    }
    // return the closest edge we found
    return {
        distance: distance,
        normal: normal,
        index: index,
    };
}

/**
 * @TODO the current implementation has no max iterations, but seems to work review edge cases
 *
 * @param {Response} out_response
 * @param {Polygon} A
 * @param {Polygon} B
 * @param {Polygon} simplex result of GJK
 */
function EPA(out_response, A, B, simplex) {
    //simplex = [[4, 2], [-8, -2], [-1, -2]];
    clear(out_response);

    var edge,
        depth,
        p,
        winding = _getWinding(simplex);
    console.log("winding", winding);

    //redo the simplex
    if (winding <= 0) {
        simplex.reverse();
    }

    // loop to find the collision information
    while (true) {
        // console.log("***************************", Polygon.toString(simplex));
        // obtain the feature (edge for 2D) closest to the origin on the Minkowski Difference
        edge = _findClosestEdge(simplex, winding);
        // console.log("_findClosestEdge", edge);
        // obtain a new support point in the direction of the edge normal
        p = polygon_furthestMinkowski([0, 0], A, B, edge.normal);
        // check the distance from the origin to the edge against the
        // distance p is along edge.normal
        depth = vec2_dot(p, edge.normal);
        // console.log(max, "distance", depth, edge.distance);
        if (depth - edge.distance < Math.EPS) {
            // the tolerance should be something positive close to zero (ex. 0.00001)

            // if the difference is less than the tolerance then we can
            // assume that we cannot expand the simplex any further and
            // we have our solution
            out_response.mtv = edge.normal;
            out_response.depth = depth;

            return true;
        } else {
            // we haven't reached the edge of the Minkowski Difference
            // so continue expanding by adding the new point to the simplex
            // in between the points that made the closest edge
            // console.log(simplex[edge.index], p);
            simplex.splice(edge.index, 0, p);
        }
    }
}


module.exports = EPA;

},{"../polygon.js":25,"../vec2.js":30,"./response.js":11}],8:[function(require,module,exports){
/**
*
* Copyright (c) 2013 Jasper Palfree http://wellcaffeinated.net/PhysicsJS/
*
* Adapted and optimized by Luis Lafuente <llafuente@noboxout.com>
*
* @todo stress test
* @source https://github.com/wellcaffeinated/PhysicsJS
* @reference https://github.com/felipetavares/bomberman/blob/master/web/modules/collision.js
* @reference http://www.codezealot.org/archives/88
* @reference http://mollyrocket.com/849
*/


// the algorithm doesn't always converge for curved shapes.
// need these constants to dictate how accurate we want to be.
var EPS = Math.EPS,
    abs = Math.abs,
    gjkMaxIterations = 100,
    Vec2 = require("../vec2.js"),
    vec2_lengthSq = Vec2.lengthSq,
    vec2_dot = Vec2.dot,
    vec2_negate = Vec2.negate,
    vec2_sub = Vec2.sub,
    vec2_perp = Vec2.perp,
    vec2_rperp = Vec2.rperp,
    vec2_copy = Vec2.copy,
    vec2_near = Vec2.near,
    vec2_ZERO = Vec2.ZERO,
    vec2_scale = Vec2.scale,
    vec2_add = Vec2.add,
    vec2_normalize = Vec2.normalize,
    vec2_swap = Vec2.swap,
    vec2_cross = Vec2.cross,
    Polygon = require("../polygon.js");

// get the next search direction from two simplex points
/**
 * @param {Vec2} ptA
 * @param {Vec2} ptB
 * @param {Vec2} dir
 */
function _getNextSearchDir(ptA, ptB, dir) {

    var ABdotB = vec2_lengthSq(ptB) - vec2_dot(ptB, ptA),
        ABdotA = vec2_dot(ptB, ptA) - vec2_lengthSq(ptA);

    // if the origin is farther than either of these points
    // get the direction from one of those points to the origin
    if (ABdotB < 0) {
        return vec2_negate(dir, ptB);
    } else if (ABdotA > 0) {
        return vec2_negate(dir, ptA);
    // otherwise, use the perpendicular direction from the simplex
    }

    // dir = AB = B - A
    vec2_sub(dir, ptB, ptA);
    // if (left handed coordinate system)
    // A cross AB < 0 then get perpendicular counterclockwise
    //return dir.perp( (ptA.cross( dir ) > 0) );
    return vec2_perp(dir, dir);
}


var gcp_A = [0, 0],
    gcp_L = [0, 0],
    gcp_aux = [0, 0];

/** hide
* _getClosestPoints( simplex ) -> Object
* - simplex (Array): The simplex
*
* Figure out the closest points on the original objects
* from the last two entries of the simplex
* @param {Polygon} simplex
* @return {Object}
**/
function _getClosestPoints(simplex) {

    // see http://www.codezealot.org/archives/153
    // for algorithm details

    // we know that the position of the last point
    // is very close to the previous. (by nature of the distance test)
    // this won't give great results for the closest
    // points algorithm, so let's use the previous two
    var len = simplex.length,
        last = simplex[len - 2],
        prev = simplex[len - 3],
        lambdaB,
        lambdaA;

    vec2_copy(gcp_A, last);

    // L = B - A
    vec2_sub(gcp_L, prev, gcp_A);

    if (vec2_near(gcp_L, vec2_ZERO, EPS)) {
        // oh.. it's a zero vector. So A and B are both the closest.
        // just use one of them
        return {
            a: last.a,
            b: last.b
        };
    }

    lambdaB = - vec2_dot(gcp_L, gcp_A) / vec2_lengthSq(gcp_L);
    lambdaA = 1 - lambdaB;

    if (lambdaA <= 0) {
        // woops.. that means the closest simplex point
        // isn't on the line it's point B itself
        return {
            a: prev.a,
            b: prev.b
        };
    } else if (lambdaB <= 0) {
        // vice versa
        return {
            a: last.a,
            b: last.b
        };
    }

    // guess we'd better do the math now...
    var a = [0, 0],
        b = [0, 0];

    vec2_scale(a, last.a, lambdaA);
    vec2_scale(gcp_aux, prev.a, lambdaB);
    vec2_add(a, a, gcp_aux);

    vec2_scale(b, last.b, lambdaA);
    vec2_scale(gcp_aux, prev.b, lambdaB);
    vec2_add(b, b, gcp_aux);

    return {
        // a closest = lambdaA * Aa + lambdaB * Ba
        a: a,
        // b closest = lambdaA * Ab + lambdaB * Bb
        b: b
    };
}

/**
*
* Implementation of Gilbert–Johnson–Keerthi (GJK)
*
*
* Returned object
*
* ```javascript
* {
*   overlap: Boolean,
*   simplex: Polygon,
*   distance: Number,
*   closest: Vec2
* }
* ```
* @todo distance seem to be not 100% right
* @param {Polygon} a_points
* @param {Polygon} b_points
* @return {Object}
**/
function getPolygonPolygon(a_points, b_points) {

    var overlap = false,
        noOverlap = false, // if we're sure we're not overlapping
        distance = false,
        simplex = [],
        simplexLen = 1,
        // use seed as starting direction or use x axis
        dir = [0, 1],
        last = [0, 0],
        lastlast = [0, 0],
        // some temp vectors
        ab,
        ac,
        sign,
        tmp,
        iterations = 0,
        dead = [],
        deadlen;

    // get the first Minkowski Difference point
    //tmp = support(dir);
    tmp = Polygon.furthestMinkowski([0, 0], a_points, b_points, dir);
    simplexLen = simplex.push(tmp);
    vec2_copy(last, tmp);
    // negate d for the next point
    vec2_negate(dir, dir);

    //console.log("simplex", Polygon.toString(simplex));

    // start looping
    gjk_end:
    while (++iterations) {

        // swap last and lastlast, to save on memory/speed
        vec2_swap(last, lastlast);
        // push a new point to the simplex because we haven't terminated yet
        //tmp = support(dir);
        tmp = Polygon.furthestMinkowski([0, 0], a_points, b_points, dir);
        simplexLen = simplex.push(tmp);
        vec2_copy(last, tmp);

        //<debug>
        //Draw.polygon(ctx, simplex, "rgba(255, 0, 0, 0.1)", true);
        //console.log("simplex", iterations, Polygon.toString(simplex), "last", Vec2.toString(last));
        //@TODO history!
        //</debug>

        // @TODO experimental, seems to work, confirm it!
        if (dead.length) {
            deadlen = dead.length - 1;
            while (deadlen--) {
                if (dead[deadlen][0] === last[0] && dead[deadlen][1] === last[1]) {
                    break gjk_end;
                }
            }
        }


        if (vec2_near(last, vec2_ZERO, EPS)) {
            // we happened to pick the origin as a support point... lucky.
            overlap = true;
            break;
        }

        // check if the last point we added actually passed the origin
        if (!noOverlap && vec2_dot(last, dir) <= 0.0) {
            // if the point added last was not past the origin in the direction of d
            // then the Minkowski difference cannot possibly contain the origin since
            // the last point added is on the edge of the Minkowski Difference

            noOverlap = true;
        }

        // if it's a line...
        if (simplexLen === 2) {

            // otherwise we need to determine if the origin is in
            // the current simplex and act accordingly

            dir = _getNextSearchDir(last, lastlast, dir);
            // continue...

        // if it's a triangle... and we're looking for the distance
        } else if (noOverlap) {

            // if we know there isn't any overlap and
            // we're just trying to find the distance...
            // make sure we're getting closer to the origin
            vec2_normalize(dir, dir);
            tmp = vec2_dot(lastlast, dir);

            if (abs(tmp - vec2_dot(last, dir)) < EPS) {
                distance = -tmp;
                break;
            }

            // if we are still getting closer then only keep
            // the points in the simplex that are closest to
            // the origin (we already know that last is closer
            // than the previous two)
            // the norm is the same as distance(origin, a)
            // use norm squared to avoid the sqrt operations
            if (vec2_lengthSq(lastlast) < vec2_lengthSq(simplex[0])) {
                dead.push(simplex.shift());
            } else {
                dead.push(simplex.splice(1, 1)[0]);
            }

            dir = _getNextSearchDir(simplex[1], simplex[0], dir);
            // continue...

        // if it's a triangle
        } else {

            // we need to trim the useless point...

            ab = ab || [0, 0];
            ac = ac || [0, 0];

            // get the edges AB and AC
            vec2_sub(ab, lastlast, last);
            vec2_sub(ac, simplex[0], last);

            // here normally people think about this as getting outward facing
            // normals and checking dot products. Since we're in 2D
            // we can be clever...
            sign = vec2_cross(ab, ac) > 0;

            if (sign ^ (vec2_cross(last, ab) > 0)) {

                // ok... so there's an XOR here... don't freak out
                // remember last = A = -AO
                // if AB cross AC and AO cross AB have the same sign
                // then the origin is along the outward facing normal of AB
                // so if AB cross AC and A cross AB have _different_ (XOR) signs
                // then this is also the case... so we proceed...

                // point C is dead to us now...
                dead.push(simplex.shift());

                // if we haven't deduced that we've enclosed the origin
                // then we know which way to look...
                // morph the ab vector into its outward facing normal

                //ab.perp( !sign );
                //// swap
                //dir.swap( ab );

                sign ? vec2_perp(dir, ab) : vec2_rperp(dir, ab);


                // continue...

                // if we get to this if, then it means we can continue to look along
                // the other outward normal direction (ACperp)
                // if we don't see the origin... then we must have it enclosed
            } else if (sign ^ (vec2_cross(ac, last) > 0)) {
                // then the origin is along the outward facing normal
                // of AC; (ACperp)

                // point B is dead to us now...
                dead.push(simplex.splice(1, 1)[0]);

                //ac.perp( sign );
                //// swap
                //dir.swap( ab );

                sign ? vec2_rperp(dir, ac) : vec2_perp(dir, ac);

                // continue...

            } else {

                // we have enclosed the origin!
                overlap = true;
                // fewf... take a break
                break;
            }
        }

        // woah nelly... that's a lot of iterations.
        // Stop it!
        if (iterations > gjkMaxIterations) {
            return {
                simplex: simplex,
                iterations: iterations,
                distance: 0,
                maxIterationsReached: true
            };
        }
    }

    tmp = {
        overlap: overlap,
        simplex: simplex,
        iterations: iterations
    };

    if (distance !== false) {

        tmp.distance = distance;
        tmp.closest = _getClosestPoints(simplex);
    }

    return tmp;
}

module.exports = {
    getPolygonPolygon: getPolygonPolygon
};
},{"../polygon.js":25,"../vec2.js":30}],9:[function(require,module,exports){
/**
 * @todo NORMALIZE OUTPUT
 */
var Vec2 = require("../vec2.js"),
    Polygon = require("../polygon.js"),
    polygon_furthestPoint = Polygon.furthestPoint,
    sqrt = Math.sqrt,
    abs = Math.abs,
    vec2_sub = Vec2.sub,
    vec2_add = Vec2.add,
    vec2_clone = Vec2.clone,
    vec2_dot = Vec2.dot,
    vec2_scale = Vec2.scale,
    vec2_negate = Vec2.negate,
    vec2_normalize = Vec2.normalize,
    vec2_perp = Vec2.perp,
    vec2_lengthSq = Vec2.lengthSq,
    vec2_div = Vec2.div;

var l = [0, 0],
    r = [0, 0],
    v = [0, 0];

/**
 * Find the separating edge for the given direction
 * @param {Polygon} polygon
 * @param {Vec2} n normal
 */
function _findSeparationEdge(polygon, n) {

    // Compute farthest polygon point in particular direction.
    var index = polygon_furthestPoint(v, polygon, n);

    var index_prev = (index + polygon.length - 1) % polygon.length;
    var index_next = (index + 1) % polygon.length;

    var v_prev = vec2_clone(polygon[index_prev]);
    var v_next = vec2_clone(polygon[index_next]);
    vec2_sub(l, v, v_next);
    vec2_sub(r, v, v_prev);

    var edge = {};

    if (vec2_dot(r, n) <= vec2_dot(l, n)) {
        return [v_prev, vec2_clone(v)];
    }

    return [vec2_clone(v), v_next];
}

var delta = [0, 0],
    _p = [0, 0];
/**
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @param {Vec2} n
 * @param {Number} o
 */
function _clipLineSegment(v1, v2, n, o) {
    var d1 = vec2_dot(n, v1) - o;
    var d2 = vec2_dot(n, v2) - o;
    var cp = [];

    if (d1 >= 0) {
        cp.push(v1);
    }

    if (d2 >= 0) {
        cp.push(v2);
    }

    if (d1 * d2 < 0) {
        vec2_sub(delta, v2, v1);
        var p = vec2_add([0, 0], v1, vec2_scale(_p, delta, d1 / (d1 - d2)));
        cp.push(p);
    }

    return cp;
}
var ccp_nn = [0, 0],
    e1d = [0, 0],
    e2d = [0, 0],
    ref_n = [0, 0],
    ref_nn = [0, 0],
    ref_perp = [0, 0];
/**
 * @source https://github.com/juhl/collision-detection-2d
 * @param {Polygon} a_points
 * @param {Polygon} b_points
 * @param {Vec2} n normal
 * @return {Object}
 */
function EdgeClipping(a_points, b_points, n) {
    var e1 = _findSeparationEdge(a_points, n);
    vec2_negate(ccp_nn, n);
    var e2 = _findSeparationEdge(b_points, ccp_nn);


    vec2_sub(e1d, e1[1], e1[0]);
    vec2_sub(e2d, e2[1], e2[0]);

    var ref;
    var inc;
    var flip;

    // The reference edge is the edge most perpendicular to the separation normal.
    // So as to separate both polygons as little as possible.
    var en1 = abs(vec2_dot(e1d, n));
    var en2 = abs(vec2_dot(e2d, n));
    if (en1 <= en2) {
        ref = e1;
        vec2_normalize(ref_n, e1d);
        inc = e2;
        flip = false;
    } else {
        ref = e2;
        vec2_normalize(ref_n, e2d);
        inc = e1;
        flip = true;
    }

    // Clip incident edge vertices using reference edge v1
    var o1 = vec2_dot(ref_n, ref[0]);
    var v = _clipLineSegment(inc[0], inc[1], ref_n, o1);
    if (v.length < 2) {
      console.log("v.length 1", v.length);
        return null;
    }

    // Clip incident edge vertices using reference edge v2
    var o2 = vec2_dot(ref_n, ref[1]);
    vec2_negate(ref_nn, ref_n);
    v = _clipLineSegment(v[0], v[1], ref_nn, -o2);
    if (v.length < 2) {
      console.log("v.length 2", v.length);
        return null;
    }

    vec2_perp(ref_perp, ref_n);

    if (flip) {
        vec2_negate(ref_perp, ref_perp);
    }

    var cp = [];
    var max = vec2_dot(ref_perp, ref[0]);
    var depth0 = vec2_dot(ref_perp, v[0]) - max;
    var depth1 = vec2_dot(ref_perp, v[1]) - max;

    if (depth0 >= 0) {
        cp.push({p: vec2_clone(v[0]), n: vec2_clone(n), d: -depth0});
    }

    if (depth1 >= 0) {
        cp.push({p: vec2_clone(v[1]), n: vec2_clone(n), d: -depth1});
    }

    return { cp: cp, incidentEdge: inc, referenceEdge: ref };
}


var cc_n = [0, 0];
/**
 * @source http://www.randygaul.net/2013/03/28/custom-physics-engine-part-2-manifold-generation/
 * @param {Circle} a_circle
 * @param {Circle} b_circle
 */
function CircleCircle(a_circle, b_circle) {
    // Setup a couple pointers to each object

    // Vector from A to B
    vec2_sub(cc_n, b_circle[0], a_circle[0]);

    var r = b_circle[1] + a_circle[1];
    r *= r;

    var length_sq = vec2_lengthSq(cc_n);
    if (length_sq > r) {
        return false;
    }

    // Circles have collided, now compute manifold
    var d = sqrt(length_sq); // perform actual sqrt

    // If distance between circles is not zero
    if (d !== 0) {
        // Distance is difference between radius and distance
        var normal = vec2_div([0, 0], cc_n, d);
        var position = vec2_scale([0, 0], normal * a_circle[1]);
        vec2_add(position, position, a_circle[0]);

        return {
            penetration: r - d,
            position: position,
            normal: normal
        };
    }

    // Circles are on same position
    // Choose random (but consistent) values
    return {
        position: a_circle[0],
        penetration: a_circle[1],
        normal: [1, 0]
    };
}

/*
EdgeClipping(
    [[8, 4], [14, 4], [8, 10], [14, 10]],
    [[12, 5], [4, 5], [12, 0], [4, 0]],
    [0, -1]
);

process.exit();
*/
module.exports = EdgeClipping;


module.exports = {
    EdgeClipping: EdgeClipping,
    CircleCircle: CircleCircle,


    // alias
    PolygonPolygon: EdgeClipping
};

},{"../polygon.js":25,"../vec2.js":30}],10:[function(require,module,exports){
var Vec2 = require("../vec2.js"),
    vec2_scale = Vec2.scale,
    vec2_dot = Vec2.dot,
    vec2_sub = Vec2.sub,
    abs = Math.abs,
    max = Math.max,
    sqrt = Math.sqrt,
    atan2 = Math.atan2,
    cos = Math.cos,
    sin = Math.sin,
    HALF_PI = Math.HALF_PI;

var mtv_v = [0, 0];
/**
 * Keep your object outside the other
 *
 * @param {Vec2} out_position
 * @param {Vec2} out_velocity
 * @param {Number} penetration_depth
 * @param {Vec2} mtv
 */
function outside(out_position, out_velocity, penetration_depth, mtv) {
    vec2_scale(mtv_v, mtv, penetration_depth);
    // left-right penetration
    if (mtv_v[0] !== 0) {
        out_position[0] = mtv_v[0];
        out_velocity[0] = 0;
    }

    // up-down penetration
    if (mtv_v[1] !== 0) {
        out_position[1] = mtv_v[1];
        out_velocity[1] = max(out_velocity[1], 0);
    }
}

var aux_vec2 = [0, 0],
    col_impulse = [0, 0],
    fric_impulse = [0, 0],
    impulse = [0, 0],
    tangent_vel = [0, 0],
    rv = [0, 0];
/**
 * @param {Vec2} out_a_velocity Velocity of A
 * @param {Number} a_restitution Coefficient of restitution of A
 * @param {Number} a_imass Inverse mass of A
 * @param {Number} a_point Point of collision in A
 * @param {Vec2} out_b_velocity Velocity of B
 * @param {Number} b_restitution Coefficient of restitution of B
 * @param {Number} b_imass Inverse mass of B
 * @param {Number} b_point Point of collision in B
 * @param {Vec2} normal collision

 * @return {Boolean} is the velocity modified ?
 */
function linear(out_a_velocity, a_restitution, a_imass, a_point, out_b_velocity, b_restitution, b_imass, b_point, normal) {
    // Calculate relative velocity
    vec2_sub(rv, out_b_velocity, out_a_velocity);

    // Calculate relative velocity in terms of the normal direction
    var normal_vel = vec2_dot(rv, normal);

    // Do not resolve if velocities are separating
    if (normal_vel > 0) {
        return false;
    }

    // Calculate restitution
    var e = Math.min(a_restitution, b_restitution);

    // Calculate impulse scalar
    var j = -(1 + e) * normal_vel;
    j /= a_imass + b_imass;

    // Apply impulse
    Vec2.scale(col_impulse, normal, j);

    //rv - Dot( rv, normal ) * normal
    vec2_sub(tangent_vel, rv, Vec2.scale(tangent_vel, normal, normal_vel));
    Vec2.normalize(tangent_vel, tangent_vel);

    // Solve for magnitude to apply along the friction vector
    var jt = -vec2_dot(rv, tangent_vel);
    jt /= a_imass + b_imass;

    var a_sfriction = 0.2;
    var b_sfriction = 0.2;

    var a_dfriction = 0.2;
    var b_dfriction = 0.2;

    // PythagoreanSolve = A^2 + B^2 = C^2, solving for C given A and B
    // Use to approximate mu given friction coefficients of each body
    var mu = sqrt(a_sfriction * a_sfriction + b_sfriction * b_sfriction);

    // Clamp magnitude of friction and create impulse vector
    if (abs(jt) < j * mu) {
        Vec2.scale(fric_impulse, tangent_vel, jt);
    } else {
        var dynamicFriction = sqrt(a_dfriction * a_dfriction + b_dfriction * b_dfriction);
        //frictionImpulse = -j * t * dynamicFriction
        Vec2.scale(fric_impulse, tangent_vel, -jt * dynamicFriction);
    }

    Vec2.add(impulse, col_impulse, fric_impulse);

    if (a_imass !== 0) {
        vec2_sub(out_a_velocity, out_a_velocity, Vec2.scale(aux_vec2, impulse, a_imass));
    }

    if (b_imass !== 0) {
        Vec2.add(out_b_velocity, out_b_velocity, Vec2.scale(aux_vec2, impulse, b_imass));
    }


    return true;
}


/*
 * Perform a fully elastic collision between the two objects
 * @reference http://en.wikipedia.org/wiki/Elastic_collision
 * @source https://github.com/benmurrell/node-multiplayer-asteroids
 *
 * @param {Vec2} a_pos
 * @param {Vec2} out_a_velocity
 * @param {Number} a_mass
 * @param {Vec2} b_pos
 * @param {Vec2} out_b_velocity
 * @param {Number} b_mass
 */
function elastic(a_pos, out_a_velocity, a_mass, b_pos, out_b_velocity, b_mass) {
    // Determine contact angle
    var contactAngle = atan2(a_pos[1] - b_pos[1], a_pos[0] - b_pos[0]);

    // Determine velocities after collision
    var vLeft = sqrt(out_a_velocity[0] * out_a_velocity[0] + out_a_velocity[1] * out_a_velocity[1]);
    var thetaLeft = atan2(out_a_velocity[1], out_a_velocity[0]);

    var vRight = sqrt(out_b_velocity[0] * out_b_velocity[0] + out_b_velocity[1] * out_b_velocity[1]);
    var thetaRight = atan2(out_b_velocity[1], out_b_velocity[0]);

    var lc_tca = cos(thetaLeft - contactAngle),
        rc_tca = cos(thetaRight - contactAngle),
        ls_tca = sin(thetaLeft - contactAngle),
        rs_tca = sin(thetaRight - contactAngle),
        cContactAngle = cos(contactAngle),
        sContactAngle = sin(contactAngle),
        mass_sum = (a_mass + b_mass),
        lmass_dif = (a_mass - b_mass),
        rmass_dif = (b_mass - a_mass),
        left_num = (vLeft * lc_tca * lmass_dif + 2 * b_mass * vRight * rc_tca),
        right_num = (vRight * rc_tca * rmass_dif + 2 * a_mass * vLeft * lc_tca);

    // elastic collision with mass
    out_a_velocity[0] = left_num / mass_sum * cContactAngle + vLeft * ls_tca * cos(contactAngle + HALF_PI);
    out_a_velocity[1] = left_num / mass_sum * sContactAngle + vLeft * ls_tca * sin(contactAngle + HALF_PI);

    out_b_velocity[0] = right_num / mass_sum * cContactAngle + vRight * rs_tca * cos(contactAngle + HALF_PI);
    out_b_velocity[1] = right_num / mass_sum * sContactAngle + vRight * rs_tca * sin(contactAngle + HALF_PI);
}

module.exports = {
    elastic: elastic,
    outside: outside,
    linear: linear
};

},{"../vec2.js":30}],11:[function(require,module,exports){
/**
 * Result of an intersection.
 * Use create or new, instances support instanceof Collision.Response
 *
 * * **a** first object participating
 * * **b** second object participating
 * * **aInB** Is a inside a (only SAT)
 * * **bInA** Is b inside a (only SAT)
 * * **depth** penetration amount
 * * **mtv** Minimum translate vector (**normalized**). If you subtract mtv * depth to a, there will be no collision.
 * * **normal** No used at this moment. This will be used in manifold generation.
 * * **poc** No used at this moment. Point of collision. This will be used in manifold generation.
 */
var Vec2 = require("../vec2.js"),
    vec2_scale = Vec2.scale;

function Response() {
    this.normal = [0, 0];
    this.mtv = [0, 0];
}

Response.prototype.a = null;
Response.prototype.b = null;
Response.prototype.aInB = true;
Response.prototype.bInA = true;
Response.prototype.depth = Number.MAX_VALUE;
Response.prototype.normal = null;
Response.prototype.mtv = null;
/**
 * equivalent to new Collision.Response()
 */
function create() {
    return new Response();
}

/**
 * Restore default values
 *
 * @param {Response} out_response
 * @return {Response}
 */
function clear(out_response) {
    out_response.aInB = true;
    out_response.bInA = true;
    out_response.depth = Number.MAX_VALUE;

    out_response.normal[0] = 0;
    out_response.normal[1] = 0;

    out_response.mtv[0] = 0;
    out_response.mtv[1] = 0;

    return out_response;
}
/**
 * Compute real mtv scaling response.mtv * response.depth
 *
 * @param {Vec2} out_vec2
 * @param {Response} response
 * @return {Vec2}
 */
function mtv(out_vec2, response) {
    vec2_scale(out_vec2, response.mtv, response.depth);
}


module.exports = Response;

Response.create = create;
Response.clear = clear;
Response.mtv = mtv;

},{"../vec2.js":30}],12:[function(require,module,exports){
/**!
* @source https://github.com/jriecken/sat-js
* @reference http://physics2d.com/content/separation-axis
*
* Version 0.4.1 - Copyright 2014 -  Jim Riecken <jimr@jimr.ca>
* Released under the MIT License
* Adapted to js-2dmath by Luis Lafuente <llafuente@noboxout.com>
*
* A simple library for determining intersections of circles and polygons using the Separating Axis Theorem.
*/

var Vec2 = require("../vec2.js"),
    Polygon = require("../polygon.js"),
    Response = require("./response.js"),
    response_clear = Response.clear,
    vec2_dot = Vec2.dot,
    vec2_sub = Vec2.sub,
    vec2_length = Vec2.length,
    vec2_lengthSq = Vec2.lengthSq,
    vec2_copy = Vec2.copy,
    vec2_normalize = Vec2.normalize,
    vec2_negate = Vec2.negate,
    vec2_scale = Vec2.scale,
    vec2_perp = Vec2.perp,

    abs = Math.abs,
    sqrt = Math.sqrt;



// Unit square polygon used for polygon hit detection.
/**
 * @type {Polygon}
 */
var UNIT_SQUARE = [[1, 0], [1, 1], [0, 1], [0, 0]],
    UNIT_SQUARE_MOVED = [[1, 0], [1, 1], [0, 1], [0, 0]];

// ## Helper Functions

/**
 * Flattens the specified array of points onto a unit vector axis,
 * resulting in a one dimensional range of the minimum and
 * maximum value on that axis.
 *
 * @param {Array.<Vec2>} points The points to flatten.
 * @param {Vec2} normal The unit vector axis to flatten on.
 * @param {Array.<number>} result An array. After calling this function, result[0] will be the minimum value, result[1] will be the maximum value.
 */
function _flattenPointsOn(points, normal, result) {
    var min = Number.MAX_VALUE,
        max = -Number.MAX_VALUE,
        len = points.length,
        i = 0,
        dot;

    for (; i < len; ++i) {
        // The magnitude of the projection of the point onto the normal
        dot = vec2_dot(points[i], normal);
        if (dot < min) { min = dot; }
        if (dot > max) { max = dot; }
    }

    result[0] = min;
    result[1] = max;
}

var rangeA = [0, 0],
    rangeB = [0, 0],
    offsetV = [0, 0];

/**
 * Check whether two convex polygons are separated by the specified
 * axis (must be a unit vector).
 *
 * @param {Response} out_response A Response object which will be populated if the axis is not a separating axis.
 * @param {Vec2} a_pos The position of the first polygon.
 * @param {Vec2} b_pos The position of the second polygon.
 * @param {Array.<Vec2>} a_points The points in the first polygon.
 * @param {Array.<Vec2>} b_points The points in the second polygon.
 * @param {Vec2} axis The axis (unit sized) to test against.  The points of both polygons will be projected onto this axis.
 * @return {Boolean} true if it is a separating axis, false otherwise.  If false, and a response is passed in, information about how much overlap and the direction of the overlap will be populated.
 */
function _isSeparatingAxis(out_response, a_pos, b_pos, a_points, b_points, axis) {
    // The magnitude of the offset between the two polygons
    vec2_sub(offsetV, b_pos, a_pos);
    var projectedOffset = vec2_dot(offsetV, axis);
    // Project the polygons onto the axis.
    _flattenPointsOn(a_points, axis, rangeA);
    _flattenPointsOn(b_points, axis, rangeB);
    // Move B's range to its position relative to A.
    rangeB[0] += projectedOffset;
    rangeB[1] += projectedOffset;
    // Check if there is a gap. If there is, this is a separating axis and we can stop
    if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
        return true;
    }
    // This is not a separating axis. If we're calculating a response, calculate the overlap.

    var overlap = 0,
        option1,
        option2;
    // A starts further left than B
    if (rangeA[0] < rangeB[0]) {
        out_response.aInB = false;
        // A ends before B does. We have to pull A out of B
        if (rangeA[1] < rangeB[1]) {
            overlap = rangeA[1] - rangeB[0];
            out_response.bInA = false;
        // B is fully inside A.  Pick the shortest way out.
        } else {
            option1 = rangeA[1] - rangeB[0];
            option2 = rangeB[1] - rangeA[0];
            overlap = option1 < option2 ? option1 : -option2;
        }
    // B starts further left than A
    } else {
        out_response.bInA = false;
        // B ends before A ends. We have to push A out of B
        if (rangeA[1] > rangeB[1]) {
            overlap = rangeA[0] - rangeB[1];
            out_response.aInB = false;
        // A is fully inside B.  Pick the shortest way out.
        } else {
            option1 = rangeA[1] - rangeB[0];
            option2 = rangeB[1] - rangeA[0];
            overlap = option1 < option2 ? option1 : -option2;
        }
    }
    // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
    var absOverlap = abs(overlap);
    if (absOverlap < out_response.depth) {
        out_response.depth = absOverlap;
        vec2_copy(out_response.mtv, axis);
        if (overlap < 0) {
            vec2_negate(out_response.mtv, out_response.mtv);
        }
    }

    return false;
}

// Calculates which Vornoi region a point is on a line segment.
// It is assumed that both the line and the point are relative to `(0,0)`
//
//            |       (0)      |
//     (-1)  [S]--------------[E]  (1)
//            |       (0)      |
/**
 * @param {Vec2} line The line segment.
 * @param {Vec2} point The point.
 * @return  {Number} LEFT_VORNOI_REGION (-1) if it is the left region, MIDDLE_VORNOI_REGION (0) if it is the middle region, RIGHT_VORNOI_REGION (1) if it is the right region.
 */
function _vornoiRegion(line, point) {
    var len2 = vec2_lengthSq(line),
        dp = vec2_dot(point, line);
    // If the point is beyond the start of the line, it is in the
    // left vornoi region.
    if (dp < 0) { return LEFT_VORNOI_REGION; }
    // If the point is beyond the end of the line, it is in the
    // right vornoi region.
    else if (dp > len2) { return RIGHT_VORNOI_REGION; }
    // Otherwise, it's in the middle one.
    else { return MIDDLE_VORNOI_REGION; }
}
// Constants for Vornoi regions
/**
 * @const
 */
var LEFT_VORNOI_REGION = -1;
/**
 * @const
 */
var MIDDLE_VORNOI_REGION = 0;
/**
 * @const
 */
var RIGHT_VORNOI_REGION = 1;

// ## Collision Tests

var pic_differenceV = [0, 0];
/**
 * Check if a point is inside a circle.
 *
 * @param {Vec2} vec2 The point to test.
 * @param {Circle} circle The circle to test.
 * @return {Boolean} true if the point is inside the circle, false if it is not.
 */
function getPointInCircle(vec2, circle) {
    vec2_sub(pic_differenceV, vec2, circle[0]);

    // If the distance between is smaller than the radius then the point is inside the circle.
    return vec2_lengthSq(pic_differenceV) <= (circle[1] * circle[1]);
}

/**
 * Check if a point is inside a convex polygon.
 *
 * @param {Response} out_response
 * @param {Vec2} vec2 The point to test.
 * @param {Polygon} poly The polygon to test.
 * @return {Boolean} true if the point is inside the polygon, false if it is not.
 */
function getPointInPolygon(out_response, vec2, poly) {
    Polygon.translate(UNIT_SQUARE_MOVED, UNIT_SQUARE, vec2);
    response_clear(out_response);

    var result = getPolygonPolygon(out_response, UNIT_SQUARE_MOVED, poly);
    if (result) {
        result = out_response.aInB;
    }
    return result;
}

var cic_differenceV = [0, 0];
/**
 * Check if two circles collide.
 *
 * @param {Response} out_response Response object that will be populated if the circles intersect.
 * @param {Circle} a_circle The first circle.
 * @param {Circle} b_circle The second circle.
 * @return {Boolean} true if the circles intersect, false if they don't.
 */
function getCircleCircle(out_response, a_circle, b_circle) {
    response_clear(out_response);

    // Check if the distance between the centers of the two
    // circles is greater than their combined radius.
    vec2_sub(cic_differenceV, b_circle[0], a_circle[0]);
    var totalRadius = a_circle[1] + b_circle[1],
        totalRadiusSq = totalRadius * totalRadius,
        distanceSq = vec2_lengthSq(cic_differenceV),
        dist;

    // If the distance is bigger than the combined radius, they don't intersect.
    if (distanceSq > totalRadiusSq) {
        return false;
    }

    // They intersect.  If we're calculating a response, calculate the overlap.
    dist = sqrt(distanceSq);
    out_response.a = a_circle;
    out_response.b = b_circle;
    out_response.depth = totalRadius - dist;

    vec2_normalize(out_response.mtv, cic_differenceV);

    out_response.aInB = a_circle[1] <= b_circle[1] && dist <= b_circle[1] - a_circle[1];
    out_response.bInA = b_circle[1] <= a_circle[1] && dist <= a_circle[1] - b_circle[1];

    return true;
}

var pc_circlePos = [0, 0],
    edge =  [0, 0],
    point =  [0, 0],
    point2 =  [0, 0],
    normal = [0, 0];

/**
 * Check if a polygon and a circle collide.
 *
 * @param {Response} out_response Response object that will be populated if they interset.
 * @param {Polygon} poly_points The polygon.
 * @param {Polygon} poly_edges The polygon edges
 * @param {Vec2} poly_pos The polygon position
 * @param {Circle} circle The circle.
 * @return {Boolean} true if they intersect, false if they don't.
 */
function getPolygonCircle(out_response, poly_points, poly_edges, poly_pos, circle) {
    response_clear(out_response);

    // Get the position of the circle relative to the polygon.
    vec2_sub(pc_circlePos, circle[0], poly_pos);

    var radius = circle[1],
        radius2 = radius * radius,
        len = poly_points.length,
        dist,
        i = 0;

    // For each edge in the polygon:
    for (; i < len; i++) {
        var next = i === len - 1 ? 0 : i + 1;
        var prev = i === 0 ? len - 1 : i - 1;
        var overlap = 0;
        var overlapN = null;

        // Get the edge.
        vec2_copy(edge, poly_edges[i]);
        // Calculate the center of the circle relative to the starting point of the edge.
        vec2_sub(point, pc_circlePos, poly_points[i]);

        // If the distance between the center of the circle and the point
        // is bigger than the radius, the polygon is definitely not fully in
        // the circle.
        if (vec2_lengthSq(point) > radius2) {
            out_response.aInB = false;
        }

        // Calculate which Vornoi region the center of the circle is in.
        var region = _vornoiRegion(edge, point);
        // If it's the left region:
        if (region === LEFT_VORNOI_REGION) {
            // We need to make sure we're in the RIGHT_VORNOI_REGION of the previous edge.
            vec2_copy(edge, poly_edges[prev]);
            // Calculate the center of the circle relative the starting point of the previous edge
            vec2_sub(point2, pc_circlePos, poly_points[prev]);
            region = _vornoiRegion(edge, point2);
            if (region === RIGHT_VORNOI_REGION) {
                // It's in the region we want.  Check if the circle intersects the point.
                dist = vec2_length(point);
                if (dist > radius) {
                    // No intersection
                    return false;
                } else {
                    // It intersects, calculate the overlap.
                    out_response.bInA = false;
                    overlapN = [0, 0];
                    vec2_normalize(overlapN, point);
                    overlap = radius - dist;
                }
            }
        // If it's the right region:
        } else if (region === RIGHT_VORNOI_REGION) {
            // We need to make sure we're in the left region on the next edge
            vec2_copy(edge, poly_edges[next]);
            // Calculate the center of the circle relative to the starting point of the next edge.
            vec2_sub(point, pc_circlePos, poly_points[next]);
            region = _vornoiRegion(edge, point);
            if (region === LEFT_VORNOI_REGION) {
                // It's in the region we want.  Check if the circle intersects the point.
                dist = vec2_length(point);
                if (dist > radius) {
                    // No intersection
                    return false;
                } else {
                    // It intersects, calculate the overlap.
                    out_response.bInA = false;
                    overlapN = [0, 0];
                    vec2_normalize(overlapN, point);
                    overlap = radius - dist;
                }
            }
        // Otherwise, it's the middle region:
        } else {
            // Need to check if the circle is intersecting the edge,
            // Change the edge into its "edge normal".
            vec2_normalize(normal, vec2_perp(edge, edge));
            // Find the perpendicular distance between the center of the
            // circle and the edge.
            dist = vec2_dot(point, normal);
            var distAbs = abs(dist);
            // If the circle is on the outside of the edge, there is no intersection.
            if (dist > 0 && distAbs > radius) {
                // No intersection
                return false;
            } else {
                // It intersects, calculate the overlap.
                overlapN = normal;
                overlap = radius - dist;
                // If the center of the circle is on the outside of the edge, or part of the
                // circle is on the outside, the circle is not fully inside the polygon.
                if (dist >= 0 || overlap < 2 * radius) {
                    out_response.bInA = false;
                }
            }
        }

        // If this is the smallest overlap we've seen, keep it.
        // (overlapN may be null if the circle was in the wrong Vornoi region).
        if (overlapN && abs(overlap) < abs(out_response.depth)) {
            out_response.depth = overlap;
            vec2_copy(out_response.mtv, overlapN);
        }
    }

    // Calculate the final overlap vector - based on the smallest overlap.
    out_response.a = poly_points;
    out_response.b = circle;

    return true;
}

/**
 * Check if a circle and a polygon collide.
 *
 * @note This is slightly less efficient than polygonCircle as it just runs polygonCircle and reverses everything at the end.
 * @param {Response} out_response Response object that will be populated if they interset.
 * @param {Circle} circle The circle.
 * @param {Polygon} poly The polygon.
 * @return {Boolean} true if they intersect, false if they don't.
 */
function getCirclePolygon(out_response, circle, poly) {
    response_clear(out_response);

    // Test the polygon against the circle.
    var result = getPolygonCircle(out_response, poly, circle);

    if (result) {
        // Swap A and B in the response.
        var a = out_response.a;
        var aInB = out_response.aInB;
        vec2_negate(out_response.mtv, out_response.mtv);
        out_response.a = out_response.b;
        out_response.b = a;
        out_response.aInB = out_response.bInA;
        out_response.bInA = aInB;
    }
    return result;
}

/**
 * Checks whether polygons collide.
 *
 * @param {Response} out_response Response object that will be populated if they interset.
 * @param {Polygon} a_points The first polygon points
 * @param {Polygon} a_normals The first polygon normals
 * @param {Polygon} a_pos The first polygon position
 * @param {Polygon} b_points The second polygon points
 * @param {Polygon} b_normals The second polygon normals
 * @param {Polygon} b_pos The second polygon position
 * @return {Boolean} true if they intersect, false if they don't.
 */
function getPolygonPolygon(out_response, a_points, a_normals, a_pos, b_points, b_normals, b_pos) {
    response_clear(out_response);

    var aLen = a_points.length,
        bLen = b_points.length,
        i;

    // If any of the edge normals of A is a separating axis, no intersection.
    for (i = 0; i < aLen; ++i) {
        if (_isSeparatingAxis(out_response, a_pos, b_pos, a_points, b_points, a_normals[i])) {
            return false;
        }
    }

    // If any of the edge normals of B is a separating axis, no intersection.
    for (i = 0;i < bLen; ++i) {
        if (_isSeparatingAxis(out_response, a_pos, b_pos, a_points, b_points, b_normals[i])) {
            return false;
        }
    }

    return true;
}

var SAT = {
    Response: Response,
    getPointInCircle: getPointInCircle,
    getPointInPolygon: getPointInPolygon,
    getCircleCircle: getCircleCircle,
    getPolygonCircle: getPolygonCircle,
    getCirclePolygon: getCirclePolygon,
    getPolygonPolygon: getPolygonPolygon
};

module.exports = SAT;

},{"../polygon.js":25,"../vec2.js":30,"./response.js":11}],13:[function(require,module,exports){
/**
 * Stability: 0 (Anything could happen)
 */

var sqrt = Math.sqrt,
    abs = Math.abs,
    min = Math.min,
    Rectangle = require("./rectangle.js"),
    x = 0,
    y = 0;

function fourPoints(x1, y1, x2, y2) {
    x = x1 - x2;
    y = y1 - y2;

    return sqrt(x * x + y * y);
}

function sqrFourPoints(x1, y1, x2, y2) {
    x = x1 - x2;
    y = y1 - y2;

    return x * x + y * y;
}

function line2_vec2(line2, vec2) {
    var __x1 = line2[0][0],
        __y1 = line2[0][1],
        __x2 = line2[0][0] + line2[1],
        __y2 = line2[0][1] + line2[1],
        __px = vec2[0],
        __py = vec2[1],
        r_numerator = (__x1 - __x2) * (__px - __x2) + (__y1 - __y2) * (__py - __y2),
        r_denomenator = (__px - __x2) * (__px - __x2) + (__py - __y2) * (__py - __y2),
        r = r_denomenator === 0 ? 0 : (r_numerator / r_denomenator),
        distanceLine,
        px,
        py,
        s;


    if ((r >= 0) && (r <= 1)) {
        return 0;
    }

    //
    px = __x2 + r * (__px - __x2);
    py = __y2 + r * (__py - __y2);
    //
    s = ((__y2 - __y1) * (__px - __x2) - (__x2 - __x1) * (__py - __y2)) / r_denomenator;
    distanceLine = abs(s) * sqrt(r_denomenator);

    return distanceLine;
}

function segment2_vec2(seg2, vec2) {
    var A = vec2[0] - seg2[0],
        B = vec2[1] - seg2[1],
        C = seg2[2] - seg2[0],
        D = seg2[3] - seg2[1],
        dot = A * C + B * D,
        len_sq = C * C + D * D,
        param = dot / len_sq,
        xx,
        yy;

    if (param < 0) {
        xx = seg2[0];
        yy = seg2[1];
    } else if (param > 1) {
        xx = seg2[2];
        yy = seg2[3];
    } else {
        xx = seg2[0] + param * C;
        yy = seg2[1] + param * D;
    }

    return fourPoints(vec2[0], vec2[1], xx, yy);
}

function rectangle_vec2(rect, vec2) {
    Rectangle.normalize(rect, rect);

    /*
    @TODO: Optimize, i cant find the right combination
    var hcat = vec2.x < rect.v1.x ? 0 : ( vec2.x > rect.v2.x ? 2 : 1 );
    var vcat = vec2.y > rect.v1.y ? 0 : ( vec2.y < rect.v2.y ? 2 : 1 );

    if(hcat == 0 && vcat == 0) return distance_vec2_vs_vec2(rect.v1, vec2);
    if(hcat == 2 && vcat == 2) return distance_vec2_vs_vec2(rect.v2, vec2);

    if(hcat == 0 && vcat == 2) return distance_vec2_vs_vec2(new Vec2(rect.v2.x, rect.v1.y), vec2);
    if(hcat == 2 && vcat == 0) return distance_vec2_vs_vec2(new Vec2(rect.v1.x, rect.v2.y), vec2);

    if(hcat == 0 && vcat == 1) return distance_segment2_vs_vec2(new Vec2(rect.v1.x, rect.v1.y), new Vec2(rect.v1.x, rect.v2.y));
    if(hcat == 1 && vcat == 0) return distance_segment2_vs_vec2(new Vec2(rect.v1.x, rect.v1.y), new Vec2(rect.v2.x, rect.v1.y));

    if(hcat == 2 && vcat == 1) return distance_segment2_vs_vec2(new Vec2(rect.v2.x, rect.v1.y), new Vec2(rect.v2.x, rect.v2.y));
    if(hcat == 1 && vcat == 2) return distance_segment2_vs_vec2(new Vec2(rect.v1.x, rect.v2.y), new Vec2(rect.v2.x, rect.v2.y));
    */

    var s1 = [rect[0][0], rect[0][1], rect[0][0], rect[1][1]],
        s2 = [rect[0][0], rect[0][1], rect[1][0], rect[0][1]],

        s3 = [rect[0][0], rect[1][1], rect[1][0], rect[1][1]],
        s4 = [rect[1][0], rect[0][1], rect[1][0], rect[1][1]];

    return min(
        segment2_vec2(s1, vec2),
        segment2_vec2(s2, vec2),
        segment2_vec2(s3, vec2),
        segment2_vec2(s4, vec2)
    );
}
/*
 * Figure 26.1
 * http://pomax.github.io/bezierinfo/
 * @todo
 */

function beizer_vec2() {

}

/**
 * @class Distance
 */
var Distance = {
    fourPoints: fourPoints,
    sqrFourPoints: sqrFourPoints,
    line2_vec2: line2_vec2,
    segment2_vec2: segment2_vec2,
    rectangle_vec2: rectangle_vec2,

    //alias
    fourPointsSq: sqrFourPoints
};


module.exports = Distance;
},{"./rectangle.js":26}],14:[function(require,module,exports){
/**
 * Utilities for rendering in CanvasElement
 */

/**
 * @param {CanvasRenderingContext2D} context2d
 * @param {Rectangle} rect
 * @param {String} style strokeStyle
 */
function rectangle(context2d, rect, style) {
    if (style !== undefined) {
        context2d.strokeStyle = style;
    }

    context2d.strokeRect(rect[0][0], rect[0][1], rect[1][0] - rect[0][0], rect[1][1] - rect[0][1]);
}

if ("undefined" !== typeof CanvasRenderingContext2D) {
    var fillText = CanvasRenderingContext2D.prototype.fillText;
    function invertFillText(a, b, c) {
        this.save();
        //ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.transform(1, 0, 0, -1, 0, 0);
        fillText.call(this, a, b, -c);
        this.restore();
    }

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
}



/**
 * calling this override fillText so you didn"t see inverted text
 * You must not modify the transformation matrix without the proper save/restore.
 * @param {CanvasElement} canvas
 * @param {CanvasRenderingContext2D} context2d
 */
function invertAxis(canvas, context2d) {
    context2d.setTransform(1, 0, 0, -1, 0, canvas.height);
    context2d.fillText = invertFillText;
}
/**
 * @param {CanvasRenderingContext2D} context2d
 * @param {Number=} coords
 * @param {Number=} count
 */
function cartesianAxis(context2d, coords, count) {
    context2d.save();

    context2d.strokeStyle = "rgba(0,0,0, 0.25)";
    //context2d.strokeStyle = "red";

    context2d.font = "6pt Consolas";


    coords = coords || 320;
    count = count || 16;

    context2d.beginPath();
    context2d.moveTo(-coords, 0);
    context2d.lineTo(coords, 0);
    context2d.stroke();

    context2d.beginPath();
    context2d.moveTo(0, -coords);
    context2d.lineTo(0, coords);
    context2d.stroke();


    if (context2d.setLineDash) {
        context2d.setLineDash([1, 2]);
    } else {
        context2d.strokeStyle = "rgba(0,0,0, 0.125)";
    }

    context2d.beginPath();
    context2d.moveTo(-coords, coords * 0.5);
    context2d.lineTo(coords, coords * 0.5);
    context2d.stroke();

    context2d.beginPath();
    context2d.moveTo(-coords, -coords * 0.5);
    context2d.lineTo(coords, -coords * 0.5);
    context2d.stroke();

    context2d.beginPath();
    context2d.moveTo(coords * 0.5, -coords);
    context2d.lineTo(coords * 0.5, coords);
    context2d.stroke();

    context2d.beginPath();
    context2d.moveTo(-coords * 0.5, -coords);
    context2d.lineTo(-coords * 0.5, coords);
    context2d.stroke();


    context2d.setLineDash([]);


    context2d.strokeStyle = "rgba(0,0,0, 0.25)";

    var i,
        inc = coords * 2 / count,
        max = count,
        x,
        y;

    context2d.textAlign = "center";
    for (i = 0; i <= max; ++i) {
        x = -coords + i * inc;
        context2d.beginPath();
        context2d.moveTo(x, 4);
        context2d.lineTo(x, -4);
        context2d.stroke();

        if (x !== 0) {
            context2d.fillText(x, x, -12);
        }
    }

    context2d.fillText("(0,0)", 0, -12);

    context2d.textAlign = "left";
    for (i = 0; i <= max; ++i) {
        y = -coords + i * inc;
        context2d.beginPath();
        context2d.moveTo(4, y);
        context2d.lineTo(-4, y);
        context2d.stroke();

        if (y !== 0) {
            context2d.fillText(y, +12, y - 4);
        }
    }

    context2d.restore();
}
/**
 * @param {CanvasRenderingContext2D} context2d
 * @param {Circle} circle
 * @param {String} style strokeStyle/fillStyle
 * @param {Boolean=} fill
 */
function circle(context2d, circle, style, fill) {
    context2d.save();

    if (style !== undefined) {
        fill ? context2d.fillStyle = style : context2d.strokeStyle = style;
    }

    context2d.beginPath();
    context2d.arc(circle[0][0], circle[0][1], circle[1], 0, 2 * Math.PI, false);
    context2d.stroke();

    context2d.beginPath();
    context2d.arc(circle[0][0], circle[0][1], 1, 0, 2 * Math.PI, false);
    fill ? context2d.fill() : context2d.stroke();

    context2d.restore();
}
/**
 * @param {CanvasRenderingContext2D} context2d
 * @param {Line2} line2
 * @param {String} style strokeStyle
 * @param {Number=} length
 */
function line2(context2d, line2, style, length) {
    context2d.save();

    if (style !== undefined) {
        context2d.strokeStyle = style;
    }

    context2d.beginPath();
    var m = line2[1];
    length = length || 100;

    context2d.moveTo(line2[0][0] - (length * m), line2[0][1] - length);
    context2d.lineTo(line2[0][0] + (length * m), line2[0][1] + length);
    context2d.stroke();

    context2d.restore();
}
/**
 * @param {CanvasRenderingContext2D} context2d
 * @param {Vec2} vec2
 * @param {String} style strokeStyle
 * @param {Number=} length
 */
function vec2(context2d, vec2, style, length) {
    context2d.save();

    length = length || 2;

    if (style !== undefined) {
        context2d.strokeStyle = style;
    }

    context2d.beginPath();
    context2d.moveTo(vec2[0] + length, vec2[1] + length);
    context2d.lineTo(vec2[0] - length, vec2[1] - length);
    context2d.stroke();

    context2d.beginPath();
    context2d.moveTo(vec2[0] - length, vec2[1] + length);
    context2d.lineTo(vec2[0] + length, vec2[1] - length);
    context2d.stroke();

    context2d.restore();
}
/**
 * @param {CanvasRenderingContext2D} context2d
 * @param {Vec2} origin
 * @param {Vec2} vec2
 * @param {Number=} length
 * @param {String} style strokeStyle
 */
function vec2dir(context2d, origin, vec2, length, style) {
    context2d.save();

    length = length || 2;

    if (style !== undefined) {
        context2d.strokeStyle = style;
    }

    context2d.beginPath();
    context2d.moveTo(origin[0], origin[1]);
    context2d.lineTo(origin[0] + vec2[0] * length, origin[1] + vec2[1] * length);
    context2d.stroke();

    context2d.restore();
}
/**
 * @param {CanvasRenderingContext2D} context2d
 * @param {Vec2} vec2
 * @param {Number} angle
 * @param {String} style strokeStyle
 * @param {Number=} length
 */
function angle(context2d, vec2, angle, style, length) {
    context2d.save();

    length = length || 10;

    if (style !== undefined) {
        context2d.strokeStyle = style;
    }

    context2d.beginPath();
    context2d.moveTo(vec2[0] + 2, vec2[1] + 2);
    context2d.lineTo(vec2[0] - 2, vec2[1] - 2);
    context2d.stroke();

    context2d.beginPath();
    context2d.moveTo(vec2[0], vec2[1]);
    context2d.lineTo(vec2[0] + Math.cos(angle) * length, vec2[1] + Math.sin(angle) * length);
    context2d.stroke();

    context2d.restore();
}
/**
 * @param {CanvasRenderingContext2D} context2d
 * @param {Segment2} seg2
 * @param {String} style strokeStyle
 */
function segment2(context2d, seg2, style) {
    context2d.save();

    if (style !== undefined) {
        context2d.strokeStyle = style;
    }

    context2d.beginPath();
    context2d.moveTo(seg2[0], seg2[1]);
    context2d.lineTo(seg2[2], seg2[3]);
    context2d.stroke();


    context2d.beginPath();
    context2d.arc(seg2[0], seg2[1], 1, 0, 2 * Math.PI, false);
    context2d.stroke();

    context2d.beginPath();
    context2d.arc(seg2[2], seg2[3], 1, 0, 2 * Math.PI, false);
    context2d.stroke();

    context2d.restore();

}
/**
 * @param {CanvasRenderingContext2D} context2d
 * @param {Triangle} tri
 * @param {String} style strokeStyle/fillStyle
 * @param {Boolean=} fill
 */
function triangle(context2d, tri, style, fill) {
    context2d.save();

    if (style !== undefined) {
        fill ? context2d.fillStyle = style : context2d.strokeStyle = style;
    }

    context2d.beginPath();
    context2d.lineTo(tri[1][0], tri[1][1]);
    context2d.lineTo(tri[2][0], tri[2][1]);
    context2d.lineTo(tri[0][0], tri[0][1]);
    context2d.lineTo(tri[1][0], tri[1][1]);
    fill ? context2d.fill() : context2d.stroke();

    context2d.restore();
}
/**
 * @param {CanvasRenderingContext2D} context2d
 * @param {AABB2} aabb2
 * @param {String} style strokeStyle/fillStyle
 * @param {Boolean=} fill
 */
function aabb2(context2d, aabb2, style, fill) {
    context2d.save();


    if (style !== undefined) {
        fill ? context2d.fillStyle = style : context2d.strokeStyle = style;
    }

    context2d.strokeRect(aabb2[0], aabb2[1], aabb2[2] - aabb2[0], aabb2[3] - aabb2[1]);

    context2d.restore();
}
/**
 * @param {CanvasRenderingContext2D} context2d
 * @param {Polygon} poly
 * @param {String} style strokeStyle/fillStyle
 * @param {Boolean=} fill
 */
function polygon(context2d, poly, style, fill) {
    context2d.save();

    if (poly.length < 3) {
        fill = false;
    }

    if (style !== undefined) {
        fill ? context2d.fillStyle = style : context2d.strokeStyle = style;
    }

    context2d.beginPath();
    context2d.moveTo(poly[0][0], poly[0][1]);
    var i,
        max;

    for (i = 1, max = poly.length; i < max; ++i) {
        context2d.lineTo(poly[i][0], poly[i][1]);
    }

    context2d.lineTo(poly[0][0], poly[0][1]);
    fill ? context2d.fill() : context2d.stroke();

    context2d.restore();
}
/**
 * @param {CanvasRenderingContext2D} context2d
 * @param {String} text
 * @param {Vec2} vec2 position
 * @param {String=} font
 */
function text(context2d, text, vec2, font) {
    font = font || "10pt Consolas";
    context2d.font = font;

    context2d.fillText(text, vec2[0], vec2[1]);
}
/**
 * @param {CanvasRenderingContext2D} context2d
 * @param {Matrix23} m2d
 */
function applyMatrix23(context2d, m2d) {
    context2d.setTransform(m2d[0], m2d[1], m2d[2], m2d[3], m2d[4], m2d[5]);
}


var Draw = {
    invertAxis: invertAxis,
    cartesianAxis: cartesianAxis,

    vec2: vec2,
    vec2dir: vec2dir,
    rectangle: rectangle,
    circle: circle,
    line2: line2,
    triangle: triangle,
    angle: angle,
    segment2: segment2,
    aabb2: aabb2,
    polygon: polygon,

    applyMatrix23: applyMatrix23,

    text: text
};

module.exports = Draw;

},{}],15:[function(require,module,exports){
var Rectangle = require("./rectangle.js"),
    Distance = require("./distance.js"),
    Segment2 = require("./segment2.js"),
    segment2$inside = Segment2.$inside,
    AABB2 = require("./aabb2.js"),
    Vec2 = require("./vec2.js"),
    abs = Math.abs,
    sqrt = Math.sqrt,
    max = Math.max,
    min = Math.min,
    EPS = Math.EPS,
    aux_vec2 = [0, 0],

    //cache
    OUTSIDE = 1, // no collision
    PARALLEL = 2, // no collision
    INSIDE = 4, // no collision
    COLLIDE = 8, // collision
    COINCIDENT = 16,  // collision
    TANGENT = 32; // collision

/**
 * @param {Number} num
 * @param {Number} num2
 * @return {Boolean}
 */
function near(num, num2) {
    return num > num2 - EPS && num < num2 + EPS;
}

//
// helpers
//

/**
 * x1 < x3
 *
 * @TODO distance
 * @TODO segment collision, maybe using segment-segment collision, this could slow down things!
 *
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 * @param {Number} x4
 * @param {Number} y4
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function $rectangle_rectangle(x1, y1, x2, y2, x3, y3, x4, y4, collision, distance) {
    var points,
        x_inside,
        y_inside;

    if (x2 < x3 || y1 > y4 || y2 < y3) {
        return {reason : OUTSIDE};
    }

    x_inside = x1 < x3 && x2 > x4;
    y_inside = y1 < y3 && y2 > y4;

    if (x_inside && y_inside) {
        return {reason : INSIDE};
    }

    if (collision === false) {
        return {reason: COLLIDE};
    }

    // complex cases, 4 point collision
    if (y1 > y3 && (x_inside || y_inside)) {
        points = [
            [max(x1, x3), max(y1, y3)],
            [min(x2, x4), min(y2, y4)],
            [min(x2, x4), max(y1, y3)],
            [max(x1, x3), min(y2, y4)]
        ];
    } else {
        //base case
        points = [
            [min(x2, x4), max(y1, y3)],
            [max(x1, x3), min(y2, y4)]
        ];
    }

    return {reason: COLLIDE, points : points};
}
/**
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function $rectangle_vec2(x1, y1, x2, y2, x3, y3, collision, distance) {
    if (x1 > x3 || x2 < x3 || y1 > y3 || y2 < y3) {
        return {reason: OUTSIDE};
        // TODO distance: distance ? Distance.rectangle_vec2(rectangle, vec2) : null
    }

    //if (bb[0] <= v[0] && bb[2] >= v[0] && bb[1] <= v[1] && bb[3] >= v[1]);
    if (x1 < x3 && x2 > x3 && y1 < y3 && y2 > y3) {
        return {reason: INSIDE};
        // TODO distance: distance ? Distance.rectangle_vec2(rectangle, vec2) : null
    }

    return {reason: COLLIDE, points : [[x3, y3]]};
}
/**
 * @param {Number} cx
 * @param {Number} cy
 * @param {Number} r
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function $circle_segment2(cx, cy, r, x1, y1, x2, y2, collision, distance) {

    var cx1 = x1 - cx,
        cy1 = y1 - cy,
        cx2 = x2 - cx,
        cy2 = y2 - cy,

        dx = cx2 - cx1,
        dy = cy2 - cy1,
        a = dx * dx + dy * dy,
        b = 2 * ((dx * cx1) + (dy * cy1)),
        c = (cx1 * cx1) + (cy1 * cy1) - (r * r),
        delta = b * b - (4 * a * c),
        u,
        u1,
        u2,
        deltasqrt,
        p,
        points;

    if (delta < 0) {
        // No intersection
        return {reason: OUTSIDE};
    }

    if (delta === 0) {
        // One intersection
        if (collision === false) {
            return {reason: TANGENT};
        }

        u = -b / (2 * a);

        p = [x1 + (u * dx), y1 + (u * dy)];

        if (segment2$inside(x1, y1, x2, y2, p[0], p[1])) {
            return {reason: TANGENT, points: [p]};
        }

        return {reason: OUTSIDE};


        /* Use LineP1 instead of LocalP1 because we want our answer in global
           space, not the circle's local space */
    }

    // NOTE do not test collision === false, here, there is no performance gain here.
    if (delta > 0) {
        // Two intersections
        deltasqrt = sqrt(delta);

        u1 = (-b + deltasqrt) / (2 * a);
        u2 = (-b - deltasqrt) / (2 * a);

        points = [];

        p = [x1 + (u1 * dx), y1 + (u1 * dy)];

        if (segment2$inside(x1, y1, x2, y2, p[0], p[1])) {
            points.push(p);
        }

        p = [x1 + (u2 * dx), y1 + (u2 * dy)];

        if (segment2$inside(x1, y1, x2, y2, p[0], p[1])) {
            points.push(p);
        }

        if (points.length) {
            return {reason: COLLIDE, points: points};
        }

        return {reason: OUTSIDE};
    }

}
/**
 * @param {Number} cx
 * @param {Number} cy
 * @param {Number} r
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function $circle_rectangle(cx, cy, r, x1, y1, x2, y2, collision, distance) {
    var points = [],
        r2,
        collide = false;

    // TODO inside test

    r2 = $circle_segment2(cx, cy, r, x1, y1, x2, y1, collision, distance);

    if (r2.reason >= COLLIDE) {
        collide = true;
        if (collision === true) {
            points.push(r2.points[0]);
            if (r2.points.length === 2) {
                points.push(r2.points[1]);
            }
        }
    }

    r2 = $circle_segment2(cx, cy, r, x1, y1, x1, y2, collision, distance);

    if (r2.reason >= COLLIDE) {
        collide = true;
        if (collision === true) {
            points.push(r2.points[0]);
            if (r2.points.length === 2) {
                points.push(r2.points[1]);
            }
        }
    }

    r2 = $circle_segment2(cx, cy, r, x1, y2, x2, y2, collision, distance);

    if (r2.reason >= COLLIDE) {
        collide = true;
        if (collision === true) {
            points.push(r2.points[0]);
            if (r2.points.length === 2) {
                points.push(r2.points[1]);
            }
        }
    }

    r2 = $circle_segment2(cx, cy, r, x2, y1, x2, y2, collision, distance);

    if (r2.reason >= COLLIDE) {
        collide = true;
        if (collision === true) {
            points.push(r2.points[0]);
            if (r2.points.length === 2) {
                points.push(r2.points[1]);
            }
        }
    }

    if (collide) {
        if (points === false) {
            return {reason: COLLIDE};
        }

        return {reason: COLLIDE, points: points};
    }

    return {reason: OUTSIDE};
}
/**
 * @param {AABB2} bb2_1
 * @param {AABB2} bb2_2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function bb2_bb2(bb2_1, bb2_2, collision, distance) {
    AABB2.normalize(bb2_1, bb2_1);
    AABB2.normalize(bb2_2, bb2_2);

    // x1 should be further left!
    if (bb2_2[0] < bb2_1[0]) {
        return $rectangle_rectangle(
            bb2_2[0], bb2_2[1], bb2_2[2], bb2_2[3],
            bb2_1[0], bb2_1[1], bb2_1[2], bb2_1[3],
            collision === true,
            distance === true
        );
    }

    return $rectangle_rectangle(
        bb2_1[0], bb2_1[1], bb2_1[2], bb2_1[3],
        bb2_2[0], bb2_2[1], bb2_2[2], bb2_2[3],
        collision === true,
        distance === true
    );
}
/**
 * @param {AABB2} bb2
 * @param {Vec2} vec2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function bb2_vec2(bb2, vec2, collision, distance) {
    return $rectangle_vec2(bb2[0], bb2[1], bb2[2], bb2[3], vec2[0], vec2[1], collision === true, distance === true);
}
/**
 * @param {Vec2} vec2
 * @param {AABB2} bb2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function vec2_bb2(vec2, bb2, collision, distance) {
    return $rectangle_vec2(bb2[0], bb2[1], bb2[2], bb2[3], vec2[0], vec2[1], collision === true, distance === true);
}

/**
 * @TODO segments of collision
 *
 * @param {Rectangle} rect1
 * @param {Rectangle} rect2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function rectangle_rectangle(rect1, rect2, collision, distance) {
    Rectangle.normalize(rect1, rect1);
    Rectangle.normalize(rect2, rect2);

    // r1 should be further left!
    if (rect2[0][0] < rect1[0][0]) {
        return $rectangle_rectangle(
            rect2[0][0], rect2[0][1], rect2[1][0], rect2[1][1],
            rect1[0][0], rect1[0][1], rect1[1][0], rect1[1][1],
            collision === true,
            distance === true
        );
    }

    return $rectangle_rectangle(
        rect1[0][0], rect1[0][1], rect1[1][0], rect1[1][1],
        rect2[0][0], rect2[0][1], rect2[1][0], rect2[1][1],
        collision === true,
        distance === true
    );

}

/**
 * @TODO segments of collision
 *
 * @param {AABB2} bb2
 * @param {AABB2} rect
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function bb2_rectangle(bb2, rect, collision, distance) {
    AABB2.normalize(bb2, bb2);
    Rectangle.normalize(rect, rect);

    // r1 should be further left!
    if (bb2[0] < rect[0][0]) {
        return $rectangle_rectangle(
            rect[0][0], rect[0][1], rect[1][0], rect[1][1],
            bb2[0], bb2[1], bb2[2], bb2[3],
            collision === true,
            distance === true
        );
    }

    return $rectangle_rectangle(
        bb2[0], bb2[1], bb2[2], bb2[3],
        rect[0][0], rect[0][1], rect[1][0], rect[1][1],
        collision === true,
        distance === true
    );
}
/**
 *
 * @param {AABB2} rect
 * @param {AABB2} bb2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function rectangle_bb2(rect, bb2, collision, distance) {
    return bb2_rectangle(bb2, rect, collision, distance);
}


/**
 *
 * @param {AABB2} rect
 * @param {Vec2} vec2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function rectangle_vec2(rect, vec2, collision, distance) {
    return $rectangle_vec2(rect[0][0], rect[0][1], rect[1][0], rect[1][1], vec2[0], vec2[1], collision === true, distance === true);
}
/**
 *
 * @param {Vec2} vec2
 * @param {AABB2} rect
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function vec2_rectangle(vec2, rect, collision, distance) {
    return $rectangle_vec2(rect[0][0], rect[0][1], rect[1][0], rect[1][1], vec2[0], vec2[1], collision === true, distance === true);
}

/**
 *
 * @param {Circle} circle
 * @param {Vec2} vec2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function circle_vec2(circle, vec2, collision, distance) {
    collision = collision === true;
    distance = distance === true;

    var distance_to_center = Vec2.distance(circle[0], vec2);

    if (near(distance_to_center, circle[1])) {
        return {reason: COLLIDE, points: [vec2]};
    }

    if (distance_to_center < circle[1]) {
        return {reason: INSIDE, distance: abs(distance_to_center - circle[1])};
    }
    return {reason: OUTSIDE, distance: abs(distance_to_center - circle[1])};
}
/**
 *
 * @param {Vec2} vec2
 * @param {Circle} circle
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function vec2_circle(vec2, circle, collision, distance) {
    circle_vec2(circle, vec2, collision, distance);
}
/**
 *
 * @param {Circle} a_circle
 * @param {Circle} b_circle
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function circle_circle(a_circle, b_circle, collision, distance) {
    collision = collision === true;
    distance = distance === true;

    var c1 = a_circle[0],
        c2 = b_circle[0],
        r1 = a_circle[1],
        r2 = b_circle[1],
        r1sq = r1 * r1,
        r2sq = r2 * r2,
        // Determine minimum and maximum radius where circles can intersect
        r_max = r1 + r2,
        r_min,
        // Determine actual distance between circle circles
        c_dist_sq = Vec2.distanceSq(c1, c2),
        c_dist,
        a,
        h,
        b,
        points,
        z;

    if (c_dist_sq > r_max * r_max) {
        return {reason: OUTSIDE};
    }

    r_min = r1 - r2;

    if (c_dist_sq < r_min * r_min) {
        return {reason: INSIDE};
    }

    if (collision === false) {
        return {reason: COLLIDE};
    }

    points = [];

    c_dist = sqrt(c_dist_sq);

    a = (r1sq - r2sq + c_dist_sq) / (2 * c_dist);
    z = r1sq - a * a;
    h = sqrt(z > 0 ? z : -z);

    Vec2.lerp(aux_vec2, c1, c2, a / c_dist);

    b = h / c_dist;

    points.push([aux_vec2[0] - b * (c2[1] - c1[1]), aux_vec2[1] + b * (c2[0] - c1[0])]);
    points.push([aux_vec2[0] + b * (c2[1] - c1[1]), aux_vec2[1] - b * (c2[0] - c1[0])]);

    return {reason: COLLIDE, points: points};
}
/**
 *
 * @param {Circle} circle
 * @param {AABB2} bb2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function circle_bb2(circle, bb2, collision, distance) {
    return $circle_rectangle(circle[0][0], circle[0][1], circle[1],
        bb2[0], bb2[1], bb2[2], bb2[3],
        collision === true, distance === true);
}
/**
 *
 * @param {AABB2} bb2
 * @param {Circle} circle
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function bb2_circle(bb2, circle, collision, distance) {
    return $circle_rectangle(circle[0][0], circle[0][1], circle[1],
        bb2[0], bb2[1], bb2[2], bb2[3],
        collision === true, distance === true);
}
/**
 *
 * @param {Circle} circle
 * @param {Rectangle} rect
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function circle_rectangle(circle, rect, collision, distance) {
    return $circle_rectangle(circle[0][0], circle[0][1], circle[1],
        rect[0][0], rect[0][1], rect[1][0], rect[1][1],
        collision === true, distance === true);
}
/**
 *
 * @param {Rectangle} rect
 * @param {Circle} circle
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function rectangle_circle(rect, circle, collision, distance) {
    return $circle_rectangle(circle[0][0], circle[0][1], circle[1],
        rect[0][0], rect[0][1], rect[1][0], rect[1][1],
        collision === true, distance === true);
}
/**
 *
 * @param {Circle} circle
 * @param {Segment2} seg2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function circle_segment2(circle, seg2, collision, distance) {
    return $circle_segment2(
        circle[0][0], circle[0][1], circle[1],
        seg2[0], seg2[1], seg2[2], seg2[3],
        collision === true,
        distance === true
    );
}
/**
 *
 * @param {Segment2} seg2
 * @param {Circle} circle
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function segment2_circle(seg2, circle, collision, distance) {
    return $circle_segment2(
        circle[0][0], circle[0][1], circle[1],
        seg2[0], seg2[1], seg2[2], seg2[3],
        collision === true,
        distance === true
    );
}
/**
 *
 * @param {Line2} line2_2
 * @param {Line2} line2_1
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function line2_line2(line2_1, line2_2, collision, distance) {
    collision = collision === true;
    distance = distance === true;

    var a1 = [line2_1[0][0], line2_1[0][1]],
        a2 = [0, 0], // XXX check! m,1 ??
        b1 = [line2_2[0][0], line2_2[0][1]],
        b2 = [0, 0],
        ua_t,
        ub_t,
        u_b,
        ua,
        ub;

    Vec2.add(a2, a1, [line2_1[1], 1]);
    Vec2.add(b2, b1, [line2_2[1], 1]);

    ua_t = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
    ub_t = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
    u_b  = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);

    if (u_b !== 0) {
        ua = ua_t / u_b;
        ub = ub_t / u_b;

        if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
            if (collision === false) {
                return {reason: COLLIDE};
            }
            return {reason: COLLIDE, points: [[a1[0] + ua * (a2[0] - a1[0]), a1[1] + ua * (a2[1] - a1[1])]]};
        }
        return {reason: OUTSIDE};
    }
    if (ua_t === 0 || ub_t === 0) {
        return {reason: COINCIDENT};
    }
    return {reason: PARALLEL};
}
/**
 *
 * @param {Segment2} seg2_2
 * @param {Segment2} seg2_1
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function segment2_segment2(seg2_1, seg2_2, collision, distance) {
    collision = collision === true;
    distance = distance === true;

    var mua,
        mub,
        denom,
        numera,
        numerb,
        points,
        i,
        max,
        minp,
        maxp,
        dist;

    denom  = (seg2_2[3] - seg2_2[1]) * (seg2_1[2] - seg2_1[0]) - (seg2_2[2] - seg2_2[0]) * (seg2_1[3] - seg2_1[1]);
    numera = (seg2_2[2] - seg2_2[0]) * (seg2_1[1] - seg2_2[1]) - (seg2_2[3] - seg2_2[1]) * (seg2_1[0] - seg2_2[0]);
    numerb = (seg2_1[2] - seg2_1[0]) * (seg2_1[1] - seg2_2[1]) - (seg2_1[3] - seg2_1[1]) * (seg2_1[0] - seg2_2[0]);

    /* Are the line coincident? */
    if (Math.abs(numera) < Math.EPS && Math.abs(numerb) < Math.EPS && Math.abs(denom) < Math.EPS) {

        if (collision === false) {
            return {
                reason : COLLIDE
            };
        }

        // check if the intersections is a line!
        points = [];
        points.push(segment2_vec2(seg2_2, [seg2_1[0], seg2_1[1]]));
        points.push(segment2_vec2(seg2_2, [seg2_1[2], seg2_1[3]]));
        points.push(segment2_vec2(seg2_1, [seg2_2[0], seg2_2[1]]));
        points.push(segment2_vec2(seg2_1, [seg2_2[2], seg2_2[3]]));
        // now check those intersections, remove no intersections!
        max = points.length;
        minp = { distance: false, point: null};
        maxp = { distance: false, point: null};


        for (i = 0; i < max; ++i) {
            if (points[i].reason <= COLLIDE) { // no collision
                points.splice(i, 1);
                --i;
                max = points.length;
            } else {

                dist = Vec2.lengthSq(points[i].points[0]);

                if (minp.distance === false || minp.distance > dist) {
                    minp.distance = dist;
                    minp.point = points[i].points[0];
                }

                if (maxp.distance === false || minp.distance < dist) {
                    maxp.distance = dist;
                    maxp.point = points[i].points[0];
                }
            }
        }

        if (points.length > 1) {
            //line intersection!
            return {
                reason : COLLIDE,
                points: [],
                segments: [[minp.point[0], minp.point[1], maxp.point[0], maxp.point[1]]]
            };
        }

        return {
            reason : COINCIDENT
        };
    }

    /* Are the line parallel */
    if (Math.abs(denom) < Math.EPS) {
        return {reason: PARALLEL};
    }

    /* Is the intersection along the the segments */
    mua = numera / denom;
    mub = numerb / denom;
    if (mua < 0 || mua > 1 || mub < 0 || mub > 1) {
        return {reason: OUTSIDE};
    }

    if (collision === false) {
        return {reason: COLLIDE};
    }

    return {reason: COLLIDE, points: [[seg2_1[0] + mua * (seg2_1[2] - seg2_1[0]), seg2_1[1] + mua * (seg2_1[3] - seg2_1[1])]]};
}

/**
 *
 * @param {Segment2} seg2
 * @param {Vec2} vec2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function segment2_vec2(seg2, vec2) {
    var dis = Distance.segment2_vec2(seg2, vec2);

    if (dis === 0) {
        return {
            reason : COLLIDE,
            points: [vec2]
        };
    }

    return {
        reason : OUTSIDE,
        distance: dis
    };
}
/**
 *
 * @param {Vec2} vec2
 * @param {Segment2} seg2
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function vec2_segment2(vec2, seg2) {
    return segment2_vec2(seg2, vec2);
}
/**
 * @TODO this is just a fast-code-version, no optimization no for real-time
 *
 * @param {Polygon} a_poly
 * @param {Polygon} b_poly
 * @param {Boolean} collision
 * @param {Boolean} distance
 */
function polygon_polygon(a_poly, b_poly) {
    var alen = a_poly.length,
        blen = b_poly.length,
        a,
        a2,
        b,
        b2,
        points = [];
    for (a = 0; a < alen; ++a) {
        a2 = a + 1;
        a2 = a2 == alen ? 0 : a2;
        for (b = 0; b < blen; ++b) {
            b2 = b + 1;
            b2 = b2 == blen ? 0 : b2;

            r = segment2_segment2(
                [a_poly[a][0], a_poly[a][1], a_poly[a2][0], a_poly[a2][1]],
                [b_poly[b][0], b_poly[b][1], b_poly[b2][0], b_poly[b2][1]],
                true,
                true
            );
            if (r.points) {
                points.push(r.points[0]);
            }

        }
    }

    if (points.length) {
        return {
            reason : COLLIDE,
            points: points,
        }
    }
    return {
        reason : OUTSIDE
    }
}

/**
 * @class Intersection
 */
var Intersection = {
    OUTSIDE: OUTSIDE,
    PARALLEL: PARALLEL,
    COLLIDE: COLLIDE,
    INSIDE: INSIDE,
    COINCIDENT: COINCIDENT,
    TANGENT: TANGENT,

    bb2_bb2: bb2_bb2,
    bb2_vec2: bb2_vec2,
    vec2_bb2: vec2_bb2,
    rectangle_rectangle: rectangle_rectangle,
    bb2_rectangle: bb2_rectangle,
    rectangle_bb2: rectangle_bb2,
    rectangle_vec2: rectangle_vec2,
    vec2_rectangle: vec2_rectangle,
    circle_vec2: circle_vec2,
    vec2_circle: vec2_circle,
    circle_circle: circle_circle,
    circle_bb2: circle_bb2,
    bb2_circle: bb2_circle,
    circle_rectangle: circle_rectangle,
    rectangle_circle: rectangle_circle,
    circle_segment2: circle_segment2,
    segment2_circle: segment2_circle,
    line2_line2: line2_line2,
    segment2_segment2: segment2_segment2,
    segment2_vec2: segment2_vec2,
    vec2_segment2: vec2_segment2,

    polygon_polygon: polygon_polygon,

    $rectangle_rectangle: $rectangle_rectangle,
    $rectangle_vec2: $rectangle_vec2,
    $circle_segment2: $circle_segment2,
    $circle_rectangle: $circle_rectangle
};


module.exports = Intersection;
},{"./aabb2.js":3,"./distance.js":13,"./rectangle.js":26,"./segment2.js":27,"./vec2.js":30}],16:[function(require,module,exports){
/*
 * Stability: 1 (Only additions & fixes)
 *
 * Point-Slope Equation of a Line: y - y1 = m(x - x1)
 */
var dx,
    dy,
    r,
    sqrt = Math.sqrt,
    tan = Math.tan,
    atan = Math.atan,
    sin = Math.sin,
    cos = Math.cos,
    near = Math.near;

/**
 * @param {Number} x
 * @param {Number} y
 * @param {Number} m
 * @return {Line2}
 */
function create(x, y, m) {
    return [[x, y], m];
}
/**
 * @return {Line2}
 */
function zero() {
    return [[0, 0], 0];
}
/**
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Line2}
 */
function fromVec2(v1, v2) {
    return [[v1[0], v1[1]], (v1[0] - v2[0]) / (v1[0] - v2[1])];
}
/**
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @return {Line2}
 */
function from2Points(x1, y1, x2, y2) {
    return [[x1, y1], (x1 - x2) / (y1 - y2)];
}
/**
 * @param {Segment2} seg2
 * @return {Line2}
 */
function fromSegment2(seg2) {
    return [[seg2[0], seg2[1]], (seg2[0] - seg2[2]) / (seg2[1] - seg2[3])];
}
/**
 * @param {Line2} out
 * @param {Line2} line2
 * @return {Line2}
 */
function copy(out, line2) {
    out[0][0] = line2[0][0];
    out[0][1] = line2[0][1];
    out[1] = line2[1];

    return out;
}
/**
 * @param {Line2} line2
 * @return {Line2}
 */
function clone(line2) {
    return [[line2[0][0], line2[0][1]], line2[1]];
}
/**
 * @param {Line2} out
 * @param {Line2} line2
 * @param {Vec2} v1
 * @return {Line2}
 */
function add(out, line2, v1) {
    out[0][0] = line2[0][0] + v1[0];
    out[0][1] = line2[0][1] + v1[1];
    out[1] = line2[1];

    return out;
}
/**
 * @param {Line2} out
 * @param {Line2} line2
 * @param {Vec2} v1
 * @return {Line2}
 */
function subtract(out, line2, v1) {
    out[0][0] = line2[0][0] - v1[0];
    out[0][1] = line2[0][1] - v1[1];
    out[1] = line2[1];

    return out;
}

/**
 * @param {Line2} out
 * @param {Line2} line2
 * @param {Vec2} offset
 * @return {Line2}
 */
function offset(out, line2, offset) {
    out[0][0] = line2[0][0] + offset;
    out[0][1] = line2[0][1];
    out[1] = line2[1];

    return out;
}

/**
 * @param {Line2} out
 * @param {Line2} line2
 * @param {Number} radians
 * @return {Line2}
 */
function rotate(out, line2, radians) {
    out[0][0] = line2[0][0];
    out[0][1] = line2[0][1];

    out[1] = tan(atan(line2[1]) + radians);

    return out;
}

/**
 * @todo
 * @source http://mathcentral.uregina.ca/QQ/database/QQ.09.04/carly1.html
 * @param {Vec2} out_vec2
 * @param {Line2} line2
 * @param {Vec2} vec2
 * @return {Vec2}
 */
function closetPoint(out_vec2, line2, vec2) {
    var m = line2[1];
        mp = 1 / m; // optimization: do not negate

    // y = m*x + y1
    // (y - y2) = m' (x - x2)

    // m*x =  m' * x - m' * x2 + y2 - y1
    // (m - m') * x =  m' * x2 + y2 - y1
    // x =  (m' * x2 + y2 - y1) / (m - m')


    out_vec2[1] = (mp * vec2[0] + vec2[1] - line2[0][1]) / (m + mp);
    out_vec2[0] = m * out_vec2[1] + line2[0][1];

    return out_vec2;
}
/**
 * Over the line, has near check to avoid floating point errors.
 * @param {Line2} line2
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function isVec2Inside(line2, vec2) {
    var p = line2[0];
    return near(line2[1], (vec2[1] - p[1]) / (vec2[0] - p[0]));
}


/**
 * @class Line2
 */
var Line2 = {
    create: create,
    zero: zero,
    fromVec2: fromVec2,
    from2Points: from2Points,
    fromSegment2: fromSegment2,
    copy: copy,
    clone: clone,
    add: add,
    subtract: subtract,
    offset: offset,
    rotate: rotate,
    closetPoint: closetPoint,
    isVec2Inside: isVec2Inside,

    // alias
    translate: add,
    sub: subtract
};


module.exports = Line2;
},{}],17:[function(require,module,exports){
var clamp,
    sqrt = Math.sqrt,
    random = Math.random,
    ceil = Math.ceil,
    floor = Math.floor,
    log = Math.log,
    PI,
    QUATER_PI,
    HALF_PI,
    HALF_NPI,
    TWO_PI,
    TWO_HALF_PI,
    NPI,
    NQUATER_PI,
    NHALF_PI,
    NTWO_PI,
    NTWO_HALF_PI,
    EPS = 10e-3,
    LOG2;

PI = Math.PI;
QUATER_PI = Math.QUATER_PI = 0.25 * Math.PI;
HALF_PI = Math.HALF_PI = 0.5 * Math.PI;
HALF_NPI = Math.HALF_NPI = -0.5 * Math.PI;
TWO_PI = Math.TWO_PI = 2 * Math.PI;
TWO_HALF_PI = Math.TWO_HALF_PI = (2 * Math.PI) + Math.HALF_PI;
NPI = Math.NPI = -Math.PI;
NQUATER_PI = Math.NQUATER_PI = 0.25 * Math.NPI;
NHALF_PI = Math.NHALF_PI = 0.5 * Math.NPI;
NTWO_PI = Math.NTWO_PI = 2 * Math.NPI;
NTWO_HALF_PI = Math.NTWO_HALF_PI = (2 * Math.NPI) + Math.HALF_PI;
LOG2 = Math.LOG2 = log(2);

Math.INV_PI = 1 / Math.PI;

Math.RAD_TO_DEG = 180 / Math.PI;
Math.DEG_TO_RAD = Math.PI / 180;

// this could be useful to tweak in your app, depends on your world resolution
Math.EPS = EPS;

/**
 * Clamp @c f to be between @c min and @c max.
 * @param {Number} a
 * @param {Number} b
 * @return {Number}
 */
function near(a, b) {
    return a > b - EPS && a < b + EPS;
}

/**
 * Clamp @c f to be between @c min and @c max.
 * @param {Number} f
 * @param {Number} minv
 * @param {Number} maxv
 * @return {Number}
 */
function clamp(f, minv, maxv) {
    return f < minv ? minv : (f > maxv ? maxv : f);
};

/**
 * Clamp @c f to be between 0 and 1.
 * @param {Number} f
 * @return {Number}
 */
function clamp01(f) {
    return f < 0 ? 0 : (f > 1 ? 1 : f);
}

/**
 * Linearly interpolate (or extrapolate) between @c f1 and @c f2 by @c t percent.
 * @param {Number} f1
 * @param {Number} f2
 * @param {Number} t
 * @return {Number}
 */
function lerp(f1, f2, t) {
    return f1 * (1 - t) + f2 * t;
}

/**
 *
 * @param {Number} a
 * @param {Number} b
 * @param {Number} percent
 * @return {Number}
 */
function lerp2(a, b, percent) {
    return a + (b - a) * percent;
}

/**
 * Linearly interpolate from @c f1 to @c f2 by no more than @c d.
 *
 * @param {Number} f1
 * @param {Number} f2
 * @param {Number} d
 * @return {Number}
 */
function lerpconst(f1, f2, d) {
    return f1 + clamp(f2 - f1, -d, d);
}
/**
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
function randInRange(min, max) {
    return lerp(min, max, random());
}
/**
 *
 * @param {Number} max
 * @param {Number} min
 * @return {Number}
 */
function randRange(max, min) {
    if (max === undefined) {
        return random();
    }
    min = min || 0;

    return random() * (max - min) + min;
}
/**
 *
 * @param {Number} max
 * @param {Number} min
 * @return {Number}
 */
function randInt(max, min) {
    min = min || 0;

    return floor(random() * (max - min + 1) + min);
}

/**
 *
 * @param {Number} value
 * @param {Number} snap_size
 * @return {Number}
 */
function snap(value, snap_size) {
    return floor(value / snap_size) * snap_size;
}

/**
 *
 * @param {Number} value
 * @param {Number} snap_size
 * @return {Number}
 */
function snapRound(value, snap_size) {
    var steps = value / snap_size | 0,
        remain = value - (steps * snap_size),
        rounder = remain > (snap_size / 2) ? ceil : floor;

    return rounder(value / snap_size) * snap_size;
}

/**
 * get the angle inside [-PI, +PI]
 * @param {Number} angle
 * @return {Number}
 */
function normalizeRotation(angle) {
    if (angle > NPI && angle < PI) {
        return angle;
    }

    angle = angle % (TWO_PI);

    if (angle < NPI) {
        angle += TWO_PI;
    } else if (angle > PI) {
        angle -= TWO_PI;
    }

    return angle;
}

/**
 * rotate the angle and return the normalized
 *
 * @param {Number} angle
 * @param {Number} target
 * @return {Number}
 */
function deltaRotation(angle, target) {
    return normalizeRotation(angle - target);
}


/**
 * Mathematical aproach rather than computaional/performance because JS Number representation is elusive
 *
 * @todo study bitwise operations can be used in all cases ?
 *
 * @param {Number} x
 * @return {Number}
 */
function powerOfTwo(x) {
    next = pow(2, ceil(log(x)/LOG2));
}
/**
 * @credits Three.js
 * @param {Number} value
 * @return {Number}
 */
function isPowerOfTwo(value) {
   return ( value & ( value - 1 ) ) === 0 && value !== 0;
}

Math.clamp = clamp;
Math.near = near;
Math.clamp01 = clamp01;
Math.lerp = lerp;
Math.lerpconst = lerpconst;
Math.randRange = randRange;
Math.randInt = randInt;
Math.snap = snap;
Math.snapRound = snapRound;
Math.deltaRotation = deltaRotation;
Math.normalizeRadians = normalizeRotation;
Math.powerOfTwo = powerOfTwo;
Math.isPowerOfTwo = isPowerOfTwo;

},{}],18:[function(require,module,exports){
/**
 * Stability: 0 (Anything could happen)
 *
 * 2x2 matrix used for rotations 2D represented as a 5 coordinates array
 * [m11:Number, m12:Number, m21:Number, m22:Number, angle:Number]
 * Can be used to solve 2x2 matrices problems.
 *
 * @todo this need more work and testing...
 */

var cos = Math.cos,
    sin = Math.sin,
    acos = Math.acos;

/**
 * @param {Number} angle
 * @return {Matrix22}
 */
function create(angle) {
    return [1, 0, 0, 1, 0];
}
/**
 * @param {Number} angle
 * @return {Matrix22}
 */
function fromAngle(angle) {
    angle = angle || 0;
    var c = cos(angle),
        s = sin(angle);

    return [c, -s, s, c, angle];
}
/**
 * @param {Number} m11
 * @param {Number} m12
 * @param {Number} m21
 * @param {Number} m22
 * @return {Matrix22}
 */
function fromNumbers(m11, m12, m21, m22) {
    return [m11, m12, m21, m22, acos(m11)];
}
/**
 * @return {Matrix22}
 */
function zero() {
    return [0, 0, 0, 0, 0];
}
/**
 * @return {Matrix22}
 */
function identity() {
    return [1, 0, 0, 1, 0];
}
/**
 * @param {Matrix22} out
 * @param {Matrix22} mat22
 * @return {Matrix22}
 */
function copy(out, mat22) {
    out[0] = mat22[0];
    out[1] = mat22[1];
    out[2] = mat22[2];
    out[3] = mat22[3];

    out[4] = mat22[4];

    return out;
}

/**
 * Solve A * x = b
 * @param {Vec2} out_vec2
 * @param {Matrix22} mat22
 * @param {Vec2} vec2
 * @return {Vec2}
 */
function solve(out_vec2, mat22, vec2) {
    var x = vec2[0],
        y = vec2[1];

    var a11 = mat22[0],
        a12 = mat22[2],
        a21 = mat22[1],
        a22 = mat22[3],
        det = 1 / (a11 * a22 - a12 * a21);

    out_vec2[0] = det * (a22 * x - a12 * y);
    out_vec2[1] = det * (a11 * y - a21 * x);

    return out_vec2;
}
/**
 * @param {Matrix22} mat22
 * @return {Number}
 */
function determinant(mat22) {
    return mat22[0] * mat22[3] - mat22[1] * mat22[2];
}
/**
 * @param {Matrix22} out
 * @param {Number} radians
 * @return {Matrix22}
 */
function setRotation(out, radians) {
    var c = cos(radians),
        s = sin(radians);

    out[0] = c;
    out[1] = -s;
    out[2] = s;
    out[3] = c;

    return out;
}
/**
 * @param {Vec2} out_vec2
 * @param {Matrix22} mat22
 * @param {Vec2} vec2
 * @return {Vec2}
 */
function rotate(out_vec2, mat22, vec2) {
    out_vec2[0] = vec2[0] * mat22[0] - vec2[1] * mat22[3];
    out_vec2[1] = vec2[0] * mat22[3] + vec2[1] * mat22[0];

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Matrix22} mat22
 * @param {Vec2} vec2
 * @return {Vec2}
 */
function unrotate(out_vec2, mat22, vec2) {
    out_vec2[0] = vec2[0] * mat22[0] + vec2[1] * mat22[3];
    out_vec2[1] = -vec2[0] * mat22[3] + vec2[1] * mat22[0];

    return out_vec2;
}
/**
 * @param {Matrix22} out
 * @param {Matrix22} mat22
 * @return {Matrix22}
 */
function invert(out, mat22) {
    var a = mat22[0],
        b = mat22[2],
        c = mat22[1],
        d = mat22[3],

        det = 1 / (a * d - b * c);

    out[0] = det * d;
    out[2] = -det * b;
    out[1] = -det * c;
    out[3] = det * a;

    return out;
}

var Matrix22 = {
    create: create,
    fromAngle: fromAngle,
    fromNumbers: fromNumbers,
    zero: zero,
    identity: identity,
    copy: copy,
    solve: solve,
    determinant: determinant,
    setRotation: setRotation,
    rotate: rotate,
    unrotate: unrotate,
    invert: invert
};

module.exports = Matrix22;
},{}],19:[function(require,module,exports){
/**
 * Stability: 1 (Only additions & fixes)
 *
 * 2x3 Transformation matrix used in 2D (column-major) represented as a 8 coordinates array
 * [m11:Number, m12:Number, m13:Number, m21:Number, m22:Number, m23:Number, **cache**:Array(5), dirty:Boolean]
 * cache = [xScale:Number, yScale:Number, xSkew:Number, yScale:Number, rotation:Number]
 * * why cache? Speed improvements in exchange of memory to avoid tan/atan2/sqrt.
 * * why dirty? Matrix.transform could be expensive with large polygons, keep track of this variable to transform only when necessary.
 * @TODO dSetSkewX / dSetSkewY
 */

// cache variables
var DEG_TO_RAD = Math.DEG_TO_RAD,
    PI = Math.PI,
    cos = Math.cos,
    sin = Math.sin,
    tan = Math.tan,
    atan2 = Math.atan2,
    __x,
    __y,
    aux_vec = [0, 0],
    c = 0,
    s = 0,
    angle = 0,
    m11 = 0,
    m12 = 0,
    m21 = 0,
    m22 = 0,
    dx = 0,
    dy = 0;

/**
 * Creates a new identity 2x3 matrix
 * @return {Matrix23}
 */
function create() {
    return [1, 0, 0, 1, 0, 0, [1, 1, 0, 0, 0], false];
}

/**
 * Creates a new matrix given 4 points(a Rectangle)
 *
 * @todo
 * @see http://jsfiddle.net/dFrHS/1/
 * @return {Matrix23} a new 2x3 matrix
 */
function fromPoints() {
}

/**
 * Creates a new matrix given 4 points(a Rectangle)
 *
 * @todo
 * @see http://jsfiddle.net/dFrHS/1/
 * @return {Matrix23} a new 2x3 matrix
 */
function fromAngle() {
    return [1, 0, 0, 1, 0, 0, [1, 1, 0, 0, 0], false];
}

/**
 * Copy m2d into out
 *
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @return {Matrix23} out 2x3 matrix
 */
function copy(out, m2d) {
    out[0] = m2d[0];
    out[1] = m2d[1];
    out[2] = m2d[2];
    out[3] = m2d[3];
    out[4] = m2d[4];
    out[5] = m2d[5];

    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2];
    out[6][3] = m2d[6][3];
    out[6][4] = m2d[6][4];

    out[7] = m2d[7];

    return out;
}
/**
 * Copy m2d into out
 *
 * @param {Matrix23} out destiny matrix
 * @return {Matrix23} out 2x3 matrix
 */
function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;

    out[6][0] = 1;
    out[6][1] = 1;
    out[6][2] = 0;
    out[6][3] = 0;
    out[6][4] = 0;

    out[7] = false;

    return out;
}

/**
 * Rotates a Matrix23 by the given angle in degrees(increment rotation)
 * @note increment rotation
 *
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Number} degrees Degrees
 * @return {Matrix23} out 2x3 matrix
 */
function dRotate(out, m2d, degrees) {
    return rotate(out, m2d, degrees * DEG_TO_RAD);
}
/**
 * Rotates a Matrix23 by the given angle in radians(increment rotation)
 * @note increment rotation
 *
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Number} radians Radians
 * @return {Matrix23} out 2x3 matrix
 */
function rotate(out, m2d, radians) {
    c = cos(radians);
    s = sin(radians);
    m11 = m2d[0] * c +  m2d[2] * s;
    m12 = m2d[1] * c +  m2d[3] * s;
    m21 = m2d[0] * -s + m2d[2] * c;
    m22 = m2d[1] * -s + m2d[3] * c;

    out[0] = m11;
    out[1] = m12;
    out[2] = m21;
    out[3] = m22;

    // copy
    out[4] = m2d[4];
    out[5] = m2d[5];
    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2];
    out[6][3] = m2d[6][3];
    out[6][4] = m2d[6][4] + radians;

    out[7] = true;

    return out;
}

/**
 * Set rotation of a Matrix23 by the given angle in degrees(set rotation)
 * @note set rotation
 *
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Number} degrees Degrees
 * @return {Matrix23} out 2x3 matrix
 */
function dRotation(out, m2d, degrees) {
    return rotation(out, m2d, degrees * DEG_TO_RAD);
}

/**
 * Set rotation of a Matrix23 by the given angle in radians(set rotation)
 * @note set rotation
 *
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Number} radians Radians
 * @return {Matrix23} out 2x3 matrix
 */
function rotation(out, m2d, radians) {
    c = radians - out[6][4];

    rotate(out, m2d, c);

    out[6][4] = radians;
    out[7] = true;

    return out;
}

/**
 * Translates given Matrix23 by the dimensions in the given vec2
 * @note This translation is affected by rotation/skew
 * @note increment position
 * @see gTranslate
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Vec2} vec2 amount to be translated
 * @return {Matrix23} out 2x3 matrix
 */
function translate(out, m2d, vec2) {
    out[0] = m2d[0];
    out[1] = m2d[1];
    out[2] = m2d[2];
    out[3] = m2d[3];
    out[4] = m2d[4] + m2d[0] * vec2[0] + m2d[2] * vec2[1];
    out[5] = m2d[5] + m2d[1] * vec2[0] + m2d[3] * vec2[1];

    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2];
    out[6][3] = m2d[6][3];
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}

/**
 * Translates given Matrix23 by the dimensions in the given vec2
 * @note This translation is NOT affected by rotation/skew
 * @note increment position
 * @see translate
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Vec2} vec2 amount to be translated
 * @return {Matrix23} out 2x3 matrix
 */
function gTranslate(out, m2d, vec2) {
    out[0] = m2d[0];
    out[1] = m2d[1];
    out[2] = m2d[2];
    out[3] = m2d[3];
    out[4] = m2d[4] + vec2[0];
    out[5] = m2d[5] + vec2[1];

    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2];
    out[6][3] = m2d[6][3];
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}

/**
 * Set Matrix23 position
 * @note This translation is NOT affected by rotation/skew
 * @note set position
 * @see gTranslate
 * @see translate
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Vec2} vec2 destiny position
 * @return {Matrix23} out 2x3 matrix
 */
function position(out, m2d, vec2) {
    out[0] = m2d[0];
    out[1] = m2d[1];
    out[2] = m2d[2];
    out[3] = m2d[3];
    out[4] = vec2[0];
    out[5] = vec2[1];

    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2];
    out[6][3] = m2d[6][3];
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}

/**
 * Scales the Matrix23 by the dimensions in the given vec2

 * @note incremental scale
 * @note do not affect position
 * @see scalation
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Vec2} vec2 destiny position
 * @return {Matrix23} out 2x3 matrix
 */
function scale(out, m2d, vec2) {
    __x = vec2[0];
    __y = vec2[1];

    out[0] = m2d[0] * __x;
    out[1] = m2d[1] * __x;
    out[2] = m2d[2] * __y;
    out[3] = m2d[3] * __y;
    out[4] = m2d[4];
    out[5] = m2d[5];

    out[6][0] = m2d[6][0] * __x;
    out[6][1] = m2d[6][1] * __y;
    out[6][2] = m2d[6][2];
    out[6][3] = m2d[6][3];
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}

/**
 * Set the Matrix23 scale by the dimensions in the given vec2

 * @note set scale
 * @note do not affect position
 * @see scale
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Vec2} vec2 destiny position
 * @return {Matrix23} out 2x3 matrix
 */
function scalation(out, m2d, vec2) {
    return scale(out, m2d, [vec2[0] / m2d[6][0], vec2[1] / m2d[6][1]]);
}

/**
 * Increment the Matrix23 x-skew by given degrees
 *
 * @note increment skewX
 * @see skewX
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Number} degrees Degrees to skew
 * @return {Matrix23} out 2x3 matrix
 */
function dSkewX(out, m2d, degrees) {
    return skewX(out, m2d, degrees * DEG_TO_RAD);
}
/**
 * Increment the Matrix23 x-skew by given radians
 *
 * @note increment skewX
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Number} radians Radians to skew
 * @return {Matrix23} out 2x3 matrix
 */
function skewX(out, m2d, radians) {
    angle = tan(radians);

    out[0] = m2d[0];
    out[1] = m2d[1];
    out[2] = m2d[2] + m2d[0] * angle;
    out[3] = m2d[3] + m2d[1] * angle;
    out[4] = m2d[4];
    out[5] = m2d[5];

    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2] + radians;
    out[6][3] = m2d[6][3];
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}

/**
 * Increment the Matrix23 y-skew by given degrees
 *
 * @note increment skewY
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Number} degrees Degrees to skew
 * @return {Matrix23} out 2x3 matrix
 */
function dSkewY(out, m2d, degrees) {
    return skewY(out, m2d, degrees * DEG_TO_RAD);
}
/**
 * Increment the Matrix23 y-skew by given radians
 *
 * @note increment skewY
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Number} radians Radians to skew
 * @return {Matrix23} out 2x3 matrix
 */
function skewY(out, m2d, radians) {
    angle = tan(radians);

    out[0] = m2d[0] + m2d[2] * angle;
    out[1] = m2d[1] + m2d[3] * angle;
    out[2] = m2d[2];
    out[3] = m2d[3];
    out[4] = m2d[4];
    out[5] = m2d[5];

    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2];
    out[6][3] = m2d[6][3] + angle;
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}

/**
 * Increment the Matrix23 skew y by given degrees in vec2_degrees
 *
 * @note increment skew
 * @see dSetSkew
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Vec2} vec2_degrees Degrees to skew
 * @return {Matrix23} out 2x3 matrix
 */
function dSkew(out, m2d, vec2_degrees) {
    aux_vec[0] = vec2_degrees[0] * DEG_TO_RAD;
    aux_vec[1] = vec2_degrees[1] * DEG_TO_RAD;

    return skew(out, m2d, aux_vec);
}

/**
 * Increment the Matrix23 skew y by given radians in vec2
 *
 * @note increment skew
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Vec2} vec2_radians Radians to skew
 * @return {Matrix23} out 2x3 matrix
 */
function skew(out, m2d, vec2_radians) {
    c = tan(vec2_radians[0]);
    s = tan(vec2_radians[1]);

    out[0] = m2d[0] + m2d[2] * s;
    out[1] = m2d[1] + m2d[3] * s;
    out[2] = m2d[2] + m2d[0] * c;
    out[3] = m2d[3] + m2d[1] * c;
    out[4] = m2d[4];
    out[5] = m2d[5];

    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2] + vec2_radians[0];
    out[6][3] = m2d[6][3] + vec2_radians[1];
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}
/**
 * Set the Matrix23 skew y by given degrees in vec2_degrees
 *
 * @note set skew
 * @see setSkew
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Vec2} vec2_degrees Degrees to skew
 * @return {Matrix23} out 2x3 matrix
 */
function dSetSkew(out, m2d, vec2_degrees) {
    aux_vec[0] = vec2_degrees[0] * DEG_TO_RAD;
    aux_vec[1] = vec2_degrees[1] * DEG_TO_RAD;

    return setSkew(out, m2d, aux_vec);
}

/**
 * Set the Matrix23 skew y by given radians in vec2
 *
 * @note set skew
 * @param {Matrix23} out destiny matrix
 * @param {Matrix23} m2d source matrix
 * @param {Vec2} vec2_radians Radians to skew
 * @return {Matrix23} out 2x3 matrix
 */
function setSkew(out, m2d, vec2_radians) {
    c = tan(vec2_radians[0] - m2d[6][2]);
    s = tan(vec2_radians[1] - m2d[6][3]);

    out[0] = m2d[0] + m2d[2] * s;
    out[1] = m2d[1] + m2d[3] * s;
    out[2] = m2d[2] + m2d[0] * c;
    out[3] = m2d[3] + m2d[1] * c;
    out[4] = m2d[4];
    out[5] = m2d[5];

    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = vec2_radians[0];
    out[6][3] = vec2_radians[1];
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}


/**
 * Multiplies two Matrix23's
 *
 * @param {Matrix23} out destiny matrix(A*B)
 * @param {Matrix23} m2d A matrix
 * @param {Matrix23} m2d_2 B matrix
 * @return {Matrix23} out 2x3 matrix
 */
function multiply(out, m2d, m2d_2) {
    m11 = m2d[0] * m2d_2[0] + m2d[2] * m2d_2[1];
    m12 = m2d[1] * m2d_2[0] + m2d[3] * m2d_2[1];

    m21 = m2d[0] * m2d_2[2] + m2d[2] * m2d_2[3];
    m22 = m2d[1] * m2d_2[2] + m2d[3] * m2d_2[3];

    dx = m2d[0] * m2d_2[4] + m2d[2] * m2d_2[5] + m2d[4];
    dy = m2d[1] * m2d_2[4] + m2d[3] * m2d_2[5] + m2d[5];

    out[0] = m11;
    out[1] = m12;
    out[2] = m21;
    out[3] = m22;
    out[4] = dx;
    out[5] = dy;


    out[6][0] = m2d[6][0];
    out[6][1] = m2d[6][1];
    out[6][2] = m2d[6][2];
    out[6][3] = m2d[6][3];
    out[6][4] = m2d[6][4];

    out[7] = true;

    return out;
}

/**
 * Multiplies a Matrix23 and a Vec2
 *
 * @param {Vec2} out_vec2 destiny Vec2
 * @param {Matrix23} m2d source Matrix23
 * @param {Vec2} vec2
 * @return {Vec2} out_vec2, result Vec2
 */
function multiplyVec2(out_vec2, m2d, vec2) {
    out_vec2[0] = vec2[0] * m2d[0] + vec2[0] * m2d[2] + vec2[0] * m2d[4];
    out_vec2[1] = vec2[1] * m2d[1] + vec2[1] * m2d[3] + vec2[1] * m2d[5];

    return out_vec2;
}

/**
 * Retrieve current position as Vec2
 *
 * @param {Vec2} out_vec2 destiny Vec2
 * @param {Matrix23} m2d source Matrix23
 * @return {Vec2} out_vec2, result Vec2
 */
function getPosition(out_vec2, m2d) {
    out_vec2[0] = m2d[4];
    out_vec2[1] = m2d[5];

    return out_vec2;
}

/**
 * Retrieve current scale as Vec2
 *
 * @param {Vec2} out_vec2 destiny Vec2
 * @param {Matrix23} m2d source Matrix23
 * @return {Vec2} out_vec2, result Vec2
 */
function getScale(out_vec2, m2d) {
    out_vec2[0] = m2d[6][0];
    out_vec2[1] = m2d[6][1];

    return out_vec2;
}

/**
 * Retrieve current skew as Vec2
 *
 * @param {Vec2} out_vec2 destiny Vec2
 * @param {Matrix23} m2d source Matrix23
 * @return {Vec2} out_vec2, result Vec2
 */
function getSkew(out_vec2, m2d) {
    out_vec2[0] = m2d[6][2];
    out_vec2[1] = m2d[6][3];

    return out_vec2;
}

/**
 * Alias of rotate 180º(PI)
 *
 * @param {Matrix23} out destiny Matrix23
 * @param {Matrix23} m2d source Matrix23
 * @return {Matrix23} out 2x3 matrix
 */
function reflect(out, m2d) {
    return rotate(out, m2d, PI);
}

/**
 * @TODO needed ?
 * @param {Matrix23} out destiny Matrix23
 * @param {Matrix23} m2d source Matrix23
 */
function transpose(out, m2d) {
}

/**
 * @TODO review & test
 * @param {Matrix23} m2d source Matrix23
 * @return {Number}
 */
function determinant(m2d) {
    var fCofactor00 = m2d[1][1] * m2d[2][2] - m2d[1][2] * m2d[2][1],
        fCofactor10 = m2d[1][2] * m2d[2][0] - m2d[1][0] * m2d[2][2],
        fCofactor20 = m2d[1][0] * m2d[2][1] - m2d[1][1] * m2d[2][0];

    return m2d[0][0] * fCofactor00 +
        m2d[0][1] * fCofactor10 +
        m2d[0][2] * fCofactor20;

}


/**
 * Returns a 3x2 2D column-major translation matrix for x and y.
 *
 * @param {Number} x
 * @param {Number} y
 * @return {Matrix23} a new 2x3 matrix
 */
function translationMatrix(x, y) {
    return [ 1, 0, 0, 1, x, y ];
}

/**
 * Returns a 3x2 2D column-major y-skew matrix for the given degrees.
 *
 * @param {Number} degrees
 * @return {Matrix23} a new 2x3 matrix
 */
function dSkewXMatrix(degrees) {
    return [ 1, 0, tan(degrees * 0.017453292519943295769236907684886), 1, 0, 0 ];
}

/**
 * Returns a 3x2 2D column-major y-skew matrix for the given radians.
 *
 * @param {Number} radians
 * @return {Matrix23} a new 2x3 matrix
 */
function skewXMatrix(radians) {
    return [ 1, 0, tan(radians), 1, 0, 0 ];
}

/**
 * Returns a 3x2 2D column-major y-skew matrix for the given degrees.
 *
 * @param {Number} degrees
 * @return {Matrix23} a new 2x3 matrix
 */
function dSkewYMatrix(degrees) {
    return [ 1, tan(degrees * 0.017453292519943295769236907684886), 0, 1, 0, 0 ];
}

/**
 * Returns a 3x2 2D column-major y-skew matrix for the given radians.
 *
 * @param {Number} radians
 * @return {Matrix23} a new 2x3 matrix
 */
function skewYMatrix(radians) {
    return [ 1, tan(radians), 0, 1, 0, 0 ];
}

/**
 * Returns a 3x2 2D column-major y-skew matrix for the given radians.
 *
 * @param {Number} radians
 * @return {Matrix23} a new 2x3 matrix
 */
function rotationMatrix(radians) {
    var c = cos(radians),
        s = sin(radians);

    return [c, -s, s, c, 0, 0 ];
}


/**
 * Returns a 3x2 2D column-major scaling matrix for x and y.
 *
 * @param {Number} x
 * @param {Number} y
 */
function scalingMatrix(x, y) {
    return [ x, 0, 0, y, 0, 0 ];
}


/**
 * Interpolate two matrixes by given factor.
 * Used in conjunction with Transitions and you will have nice transformations :)
 *
 * @param {Matrix23} out
 * @param {Matrix23} m2d first matrix
 * @param {Matrix23} m2d_2 second matrix
 * @param {Number} factor
 * @return {Matrix23}
 */
function interpolate(out, m2d, m2d_2, factor) {
    out[0] = m2d[0] + ((m2d_2[0] - m2d[0]) * factor);
    out[1] = m2d[1] + ((m2d_2[1] - m2d[1]) * factor);
    out[2] = m2d[2] + ((m2d_2[2] - m2d[2]) * factor);
    out[3] = m2d[3] + ((m2d_2[3] - m2d[3]) * factor);
    out[4] = m2d[4] + ((m2d_2[4] - m2d[4]) * factor);
    out[5] = m2d[5] + ((m2d_2[5] - m2d[5]) * factor);

    var o = out[6],
        i1 = m2d[6],
        i2 = m2d_2[6];

    o[0] = i1[0] + ((i2[0] - i1[0]) * factor);
    o[1] = i1[1] + ((i2[1] - i1[1]) * factor);
    o[2] = i1[2] + ((i2[2] - i1[2]) * factor);
    o[3] = i1[3] + ((i2[3] - i1[3]) * factor);
    o[4] = i1[4] + ((i2[4] - i1[4]) * factor);

    out[7] = m2d[7];

    return out;
}

/**
 * For completeness because it's not need in the current implementation just get: m2d[6][4]
 *
 * @param {Matrix23} m2d
 */
function toAngle(m2d) {
    return atan2(m2d[1], m2d[0]);
}
/**
 * Transform a vector by given matrix
 *
 * @param {Vec2} out_vec2
 * @param {Matrix23} m2d
 * @param {Vec2} vec2
 * @return {Vec2}
 */
function transform(out_vec2, m2d, vec2) {
    var x = vec2[0] * m2d[0] + vec2[1] * m2d[2] + m2d[4],
        y = vec2[0] * m2d[1] + vec2[1] * m2d[3] + m2d[5];

    out_vec2[0] = x;
    out_vec2[1] = y;

    return out_vec2;
}


var Matrix23 =  {
    create: create,
    fromPoints: fromPoints,
    copy: copy,
    identity: identity,
    dRotate: dRotate,
    rotate: rotate,
    dRotation: dRotation,
    rotation: rotation,
    translate: translate,
    gTranslate: gTranslate,
    position: position,
    scale: scale,
    scalation: scalation,
    dSkewX: dSkewX,
    skewX: skewX,
    dSkewY: dSkewY,
    skewY: skewY,
    dSkew: dSkew,
    skew: skew,
    dSetSkew: dSetSkew,
    setSkew: setSkew,
    multiply: multiply,
    multiplyVec2: multiplyVec2,
    getPosition: getPosition,
    getScale: getScale,
    getSkew: getSkew,
    reflect: reflect,
    transpose: transpose,
    determinant: determinant,
    translationMatrix: translationMatrix,
    dSkewXMatrix: dSkewXMatrix,
    skewXMatrix: skewXMatrix,
    dSkewYMatrix: dSkewYMatrix,
    skewYMatrix: skewYMatrix,
    scalingMatrix: scalingMatrix,
    rotationMatrix: rotationMatrix,

    interpolate: interpolate,
    transform: transform,

    toAngle: toAngle,

    // alias
    dSetRotation: dRotation,
    setRotation: rotation,
    setPosition: position,
    setScale: scalation,
};

module.exports = Matrix23;

},{}],20:[function(require,module,exports){
/**
 * Stability: 2 (fixes / performance improvements)
 * ~Quadtree implementation that allow to override the number of subdivision for the first level
 * This is specially useful for rectangular worlds
 *
 * @reference http://en.wikipedia.org/wiki/Quadtree
 */

var AABB2 = require("./aabb2.js"),
    AABB2_fromAABB2Division = AABB2.fromAABB2Division,
    AABB2_contains = AABB2.contains;

/**
 * Constructor
 * @param {AABB2} aabb2
 * @param {Number=} maxObjects
 * @param {Number=} maxLevels
 * @param {Vec2=} subdivisions
 */
function NMtree(aabb2, maxObjects, maxLevels, subdivisions) {
    this.objects = [];
    this.bounds = aabb2;
    this.maxObjects = maxObjects || 10;
    this.maxLevels = maxLevels || 4;
    this.subdivisions = subdivisions || [2, 2];
}

NMtree.prototype.level = 0;
NMtree.prototype.maxLevels = 4;
NMtree.prototype.maxObjects = 10;
NMtree.prototype.subtrees = null;
NMtree.prototype.bounds = null;
NMtree.prototype.objects = [];
NMtree.prototype.subdivisions = [2, 2];

NMtree.prototype.divide = function () {
    var objs = this.objects,
        i,
        j,
        max,
        bounds = AABB2_fromAABB2Division(this.bounds, this.subdivisions[0], this.subdivisions[1]),
        qt;

    this.subtrees = [];
    this.objects = [];

    for (j = 0, max = bounds.length; j < max; j++) {
        qt = new NMtree(bounds[j]),// this.maxObjects, this.maxLevels);

        qt.level = this.level + 1; // manually set
        this.subtrees.push(qt);
    }
    for (i = 0, max = objs.length; i < max; i++) {
        if (!this.subinsert(objs[i])) {
            this.objects.push(objs[i]);
        }
    }
};

/**
 * @param {Object}
 */
NMtree.prototype.subinsert = function (obj) {
    if (!this.subtrees) {
        return false;
    }

    var j = 0,
        max = this.subtrees.length;
    while (j < max && !this.subtrees[j].insert(obj.bounds, obj.userdata)) {
        ++j;
    }

    return j !== max;
};

/**
 * @param {AABB2} aabb2
 * @param {Mixed} userdata
 */
NMtree.prototype.insert = function (aabb2, userdata) {
    if (AABB2_contains(this.bounds, aabb2)) {
        var obj = {bounds: aabb2, userdata: userdata};

        if (!this.subinsert(obj)) {
            if (!this.subtrees && this.objects.length === this.maxObjects && this.level < this.maxLevels) {
                this.divide();
                if (this.subinsert(obj)) { //retry
                    return true;
                }
            }
            this.objects.push(obj);
        }
        return true;
    }
    return false;
};

/**
 * @param {Mixed} userdata
 * @param {Array} out
 */
NMtree.prototype.retrieve = function (userdata, out) {
    out = out || [];

    var i,
        max,
        objs = this.objects,
        found;

    if (objs && objs.length) {
        for (i = 0, max = objs.length; i < max && !found; i++) {
            if (objs[i].userdata === userdata) {
                found = true;
            }
        }
    }

    if (found) {
        this.iterate(function (qt) {
            if (qt.objects) {
                var i,
                    max;
                for (i = 0, max = qt.objects.length; i < max; ++i) {
                    out.push(qt.objects[i]);
                }
            }
        });

        return out;
    } else if (this.subtrees) {
        for (i = 0, max = this.subtrees.length; i < max; i++) {
            this.subtrees[i].retrieve(userdata, out);
        }
    }

    return out;
};

/**
 * @param {Function} callback
 */
NMtree.prototype.iterate = function (callback) {
    var i,
        max;

    callback(this);

    if (this.subtrees) {
        for (i = 0, max = this.subtrees.length; i < max; ++i) {
            this.subtrees[i].iterate(callback);
        }
    }
};

/**
 * @param {Mixed} userdata
 */
NMtree.prototype.remove = function (userdata) {
    var i,
        max,
        objs = this.objects,
        found;

    if (objs && objs.length) {
        for (i = 0, max = objs.length; i < max && !found; i++) {
            if (objs[i].userdata === userdata) {
                objs.splice(i, 1);
                return true;
            }
        }
    }

    if (this.subtrees) {
        for (i = 0, max = this.subtrees.length; i < max; i++) {
            if (this.subtrees[i].remove(userdata)) {
                return true;
            }
        }
    }
    return false;
};

module.exports = NMtree;
},{"./aabb2.js":3}],21:[function(require,module,exports){
var object = require("object-enhancements"),
    Xorshift = require("./xorshift.js"),
    GRAD3 = [
        [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
        [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
        [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
    ],

    GRAD4 = [
        [0, 1, 1, 1],  [0, 1, 1, -1],  [0, 1, -1, 1],  [0, 1, -1, -1],
        [0, -1, 1, 1], [0, -1, 1, -1], [0, -1, -1, 1], [0, -1, -1, -1],
        [1, 0, 1, 1],  [1, 0, 1, -1],  [1, 0, -1, 1],  [1, 0, -1, -1],
        [-1, 0, 1, 1], [-1, 0, 1, -1], [-1, 0, -1, 1], [-1, 0, -1, -1],
        [1, 1, 0, 1],  [1, 1, 0, -1],  [1, -1, 0, 1],  [1, -1, 0, -1],
        [-1, 1, 0, 1], [-1, 1, 0, -1], [-1, -1, 0, 1], [-1, -1, 0, -1],
        [1, 1, 1, 0],  [1, 1, -1, 0],  [1, -1, 1, 0],  [1, -1, -1, 0],
        [-1, 1, 1, 0], [-1, 1, -1, 0], [-1, -1, 1, 0], [-1, -1, -1, 0]
    ],

    SIMPLEX = [
        [0, 1, 2, 3], [0, 1, 3, 2], [0, 0, 0, 0], [0, 2, 3, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 2, 3, 0],
        [0, 2, 1, 3], [0, 0, 0, 0], [0, 3, 1, 2], [0, 3, 2, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 3, 2, 0],
        [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],
        [1, 2, 0, 3], [0, 0, 0, 0], [1, 3, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 3, 0, 1], [2, 3, 1, 0],
        [1, 0, 2, 3], [1, 0, 3, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 3, 1], [0, 0, 0, 0], [2, 1, 3, 0],
        [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],
        [2, 0, 1, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [3, 0, 1, 2], [3, 0, 2, 1], [0, 0, 0, 0], [3, 1, 2, 0],
        [2, 1, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [3, 1, 0, 2], [0, 0, 0, 0], [3, 2, 0, 1], [3, 2, 1, 0]
    ],
    sqrt = Math.sqrt,
    floor = Math.floor,
    random = Math.random,
    sqrt_of_3 = sqrt(3),

    Noise = {};

// from: http://jsdo.it/akm2/fhMC/js
// don't know the author, if you are contact me.
// I just lint the code (a little)... and adapt it to the lib philosophy (that means remove 3d noises)

//@TODO optimize, there is performance gain everywhere!


// Common helpers

function _dot2d(g, x, y) {
    return g[0] * x + g[1] * y;
}

function _dot3d(g, x, y, z) {
    return g[0] * x + g[1] * y + g[2] * z;
}

// Simplex helper

function _dot4d(g, x, y, z, w) {
    return g[0] * x + g[1] * y + g[2] * z + g[3] * w;
}

// Classic helpers

function _mix(a, b, t) {
    return (1 - t) * a + t * b;
}

function _fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}



/*
 * @reference http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
 *
 * Tiling Example (heavy...)
 *
 * var perlinNoise = new PerlinNoise();
 *
 * function tilingNoise2d(x, y, w, h) {
 *     return (perlinNoise.noise(x, y) * (w - x) * (h - y) +
 *         perlinNoise.noise(x - w, y) * x * (h - y) +
 *         perlinNoise.noise(x - w, y - h) * x * y +
 *         perlinNoise.noise(x, y - h) * (w - x) * y) / (w * h);
 */


/**
 * @class ClassicNoise
 * @param {Number} seed
 */
function ClassicNoise(seed) {
    this.seed(seed);
}

ClassicNoise.prototype = {
    _octaves: 4,
    _fallout: 0.5,

    seed: function (seed) {
        var random = Xorshift.create(seed || new Date().getTime()).random,
            i,
            p = [],
            perm = [];

        for (i = 0; i < 256; i++) {
            p[i] = floor(random() * 256);
        }

        for (i = 0; i < 512; i++) {
            perm[i] = p[i & 255];
        }

        this._perm = perm;
    },

    octaves: function (octaves) {
        if (!arguments.length) {
            return this._octaves;
        }
        return this._octaves = octaves;
    },

    fallout: function (fallout) {
        if (!arguments.length) {
            return this._fallout;
        }
        return this._fallout = fallout;
    },

    noise: function (x, y) {
        var result = 0,
            noise,
            f = 1,
            oct = this._octaves,
            amp = 0.5,
            fallout = this._fallout,
            i;

        for (i = 0; i < oct; ++i) {
            result += (1 + this.noise2d(x * f, y * f)) * amp * 0.5;
            amp *= fallout;
            f *= 2;
        }

        return result;
    },

    noise2d: function (x, y) {
        var X = floor(x),
            Y = floor(y),
            perm = this._perm;

        x = x - X;
        y = y - Y;

        X = X & 255;
        Y = Y & 255;


        var gi00 = perm[X + perm[Y]] % 12,
            gi01 = perm[X + perm[Y + 1]] % 12,
            gi10 = perm[X + 1 + perm[Y]] % 12,
            gi11 = perm[X + 1 + perm[Y + 1]] % 12,

            n00 = _dot2d(GRAD3[gi00], x, y),
            n10 = _dot2d(GRAD3[gi10], x - 1, y),
            n01 = _dot2d(GRAD3[gi01], x, y - 1),
            n11 = _dot2d(GRAD3[gi11], x - 1, y - 1),

            u = _fade(x),
            v = _fade(y),

            nx0 = _mix(n00, n10, u),
            nx1 = _mix(n01, n11, u),

            nxy = _mix(nx0, nx1, v);

        return nxy;
    }
};


/**
 * SimplexNoise
 *
 * @super ClassicNoise
 * @param {Number} seed
 */
function SimplexNoise(seed) {
    this.seed(seed);
}

SimplexNoise.prototype = object.extend({}, ClassicNoise.prototype, {
    noise: function (x, y, z, w) {
        var result = 0,
            noise,
            f = 1,
            oct = this._octaves,
            amp = 0.5,
            fallout = this._fallout,
            i;

        for (i = 0; i < oct; ++i) {
            result += (1 + this.noise2d(x * f, y * f)) * amp * 0.5;
            amp *= fallout;
            f *= 2;
        }

        return result;
    },

    noise2d: function (x, y) {
        var n0,
            n1,
            n2,

            F2 = 0.5 * (sqrt_of_3 - 1),
            s = (x + y) * F2,
            i = floor(x + s),
            j = floor(y + s),

            G2 = (3 - sqrt_of_3) / 6,
            t = (i + j) * G2,
            X0 = i - t,
            Y0 = j - t,
            x0 = x - X0,
            y0 = y - Y0,

            i1,
            j1,

            perm = this._perm;

        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        } else {
            i1 = 0;
            j1 = 1;
        }

        var x1 = x0 - i1 + G2,
            y1 = y0 - j1 + G2,

            x2 = x0 - 1 + 2 * G2,
            y2 = y0 - 1 + 2 * G2,

            ii = i & 255,
            jj = j & 255,

            gi0 = perm[ii + perm[jj]] % 12,
            gi1 = perm[ii + i1 + perm[jj + j1]] % 12,
            gi2 = perm[ii + 1 + perm[jj + 1]] % 12,

            t0 = 0.5 - x0 * x0 - y0 * y0;

        if (t0 < 0) {
            n0 = 0;
        } else {
            t0 *= t0;
            n0 = t0 * t0 * _dot2d(GRAD3[gi0], x0, y0);
        }

        var t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 < 0) {
            n1 = 0;
        } else {
            t1 *= t1;
            n1 = t1 * t1 * _dot2d(GRAD3[gi1], x1, y1);
        }

        var t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 < 0) {
            n2 = 0;
        } else {
            t2 *= t2;
            n2 = t2 * t2 * _dot2d(GRAD3[gi2], x2, y2);
        }

        return 70 * (n0 + n1 + n2);
    }
});

function createClassic(seed) {
    return new ClassicNoise(seed);
}

function createSimpleX(seed) {
    return new SimplexNoise(seed);
}

Noise = {
    GRAD3: GRAD3,
    GRAD4: GRAD4,
    SIMPLEX: SIMPLEX,

    ClassicNoise: ClassicNoise,
    SimplexNoise: SimplexNoise,

    createClassic: createClassic,
    createSimpleX: createSimpleX
};

module.exports = Noise;
},{"./xorshift.js":31,"object-enhancements":34}],22:[function(require,module,exports){
var Vec2 = require("../vec2.js"),
    vec2_add = Vec2.add,
    vec2_scale = Vec2.scale,
    aux = [0, 0];
/**
 * @param {Vec2} position
 * @param {Vec2} velocity
 * @param {Number} dt
 */
function euler(position, velocity, dt) {
    vec2_add(position, position, vec2_scale(aux, velocity, dt));
}

module.exports = euler;

},{"../vec2.js":30}],23:[function(require,module,exports){
/**
 * Runge–Kutta 4
 *
 * @reference http://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods
 * @reference http://www.gaffer.org/articles
 * @source https://github.com/wellcaffeinated/PhysicsJS/blob/master/src/integrators/verlet.js
 * @source http://mtdevans.com/2013/05/fourth-order-runge-kutta-algorithm-in-javascript-with-demo/
 * @source http://doswa.com/2009/01/02/fourth-order-runge-kutta-numerical-integration.html
 */

var k = 10;
var b = 1;

/**
* @param {Number} x position
* @param {Number} v velocity
* @param {Number} ni_mass negated inverse of mass (-1/m)
* @param {Number} stiffness
* @param {Number} damping
* @param {Number} dt
* @param {Number} hdt dt * 0.5
* @param {Number} idt dt / 0.5
* @return {Array} [new_position, new_velocity]
*/
function rk4(x, v, ni_mass, stiffness, damping, dt, hdt, idt) {
  // Returns final (position, velocity) array after time dt has passed.
  //        x: initial position
  //        v: initial velocity
  //        a: acceleration function a(x,v,dt) (must be callable)
  //        dt: timestep
  var x1 = x;
  var v1 = v;
  var a1 = (stiffness * x1 + damping * v1) * ni_mass;

  var x2 = x + v1 * hdt;
  var v2 = v + a1 * hdt;
  var a2 = -(stiffness * x2 + damping * v2) * ni_mass;

  var x3 = x + v2 * hdt;
  var v3 = v + a2 * hdt;
  var a3 = (stiffness * x3 + damping * v3) * ni_mass;

  var x4 = x + v3 * dt;
  var v4 = v + a3 * dt;
  var a4 = (stiffness * x4 + damping * v4) * ni_mass;

  var xf = x + idt * (v1 + 2 * (v2 + v3) + v4);
  var vf = v + idt * (a1 + 2 * (a2 + a3) + a4);

  return [xf, vf];
}
/*
var ts = 0;
var max_ts = 50;
var dt = 0.1;
var state = [100, 0];
var stiffness = 1;
var damping = 0;

var interval = setInterval(function () {
    ts+=dt;

    state = rk4(state[0], state[1], -1, stiffness, damping, dt, dt * 0.5, dt * 0.166666667);

    console.log(state[0].toFixed(2), state[1].toFixed(2));
    //console.log(state2.position.toFixed(2), " - ", state2.velocity.toFixed(2));
    //console.log();

    if (ts > max_ts) {
        clearInterval(interval);
    }

}, dt * 10);
*/

// node lib/integrators.js > output.dat && gnuplot -e "set term png; set output 'printme.png'; set zeroaxis; plot 'output.dat' using 1:2 with lines; set term x11" && firefox printme.png


module.exports = rk4;
},{}],24:[function(require,module,exports){
var Vec2 = require("../vec2.js"),
    vec2_sub = Vec2.sub,
    vec2_add = Vec2.add,
    vec2_scale = Vec2.scale,
    aux = [0, 0];

/**
 * @param {Vec2} out_position
 * @param {Vec2} velocity
 * @param {Vec2} last_velocity
 * @param {Number} dt
 */
function verlet(out_position, velocity, last_velocity, dt) {
    vec2_add(aux, last_velocity, velocity);
    vec2_scale(aux, aux, 0.5 * dt);

    return vec2_add(out_position, out_position, aux);
}


/**
 * maybe this implementation could be better, some test ?!
 * @source http://lonesock.net/article/verlet.html
 *
 * @param {Vec2} out_position
 * @param {Vec2} velocity
 * @param {Vec2} last_velocity
 * @param {Number} dt
 * @param {Number} last_dt
 */
function tc_verlet(out_position, velocity, last_velocity, dt, last_dt) {
    vec2_sub(aux, velocity, last_velocity);
    vec2_scale(aux, aux, dt / last_dt);

    vec2_add(aux, velocity, aux);
    vec2_scale(aux, aux, 0.5 * dt);
    vec2_add(out_position, out_position, aux);
}

module.exports = verlet;

},{"../vec2.js":30}],25:[function(require,module,exports){
var Vec2 = require("./vec2.js"),
    vec2_add = Vec2.add,
    vec2_sub = Vec2.sub,
    vec2_dot = Vec2.dot,
    vec2_crossLength = Vec2.crossLength,
    vec2_cross = Vec2.cross,
    vec2_scale = Vec2.scale,
    vec2_negate = Vec2.negate,
    vec2_normalize = Vec2.normalize,
    vec2_lengthSq = Vec2.lengthSq,
    vec2_perp = Vec2.perp,

    Matrix23 = require("./matrix23.js"),

    Beizer = require("./beizer.js"),
    beizer_getPoints = Beizer.getPoints,
    f,
    sum = 0,
    cross = 0,
    x,
    y,
    o,
    p,
    sqrt = Math.sqrt,
    cos = Math.cos,
    abs = Math.abs,
    sin = Math.sin,
    EPS = Math.EPS;
/**
 * input are many Vec2(s)
 * @return {Polygon}
 */
function create() {
    var i,
        len = arguments.length,
        out = new Array(len);

    for (i = 0; i < len; ++i) {
        out[i] = arguments[i];
    }

    return out;
}

/*
 * Create the convex hull using the Gift wrapping algorithm
 * @source https://github.com/juhl/collision-detection-2d/blob/master/util.js
 * @reference http://en.wikipedia.org/wiki/Gift_wrapping_algorithm
 * @reference http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain
 * @param {Vec2[]} vec2_list
 * @return {Polygon}
 */
function createConvexHull(vec2_list) {
    // Find the right most point on the hull
    var i0 = 0,
        x0 = vec2_list[0][0],
        i,
        x;

    for (i = 1; i < vec2_list.length; i++) {
        x = vec2_list[i][0];
        if (x > x0 || (x === x0 && vec2_list[i][1] < vec2_list[i0][1])) {
            i0 = i;
            x0 = x;
        }
    }

    var n = vec2_list.length,
        hull = [],
        m = 0,
        ih = i0,
        ie,
        j,
        r = [0, 0],
        v = [0, 0],
        c;

    do {
        hull[m] = ih;

        ie = 0;
        for (j = 1; j < n; ++j) {
            if (ie === ih) {
                ie = j;
                continue;
            }

            vec2_sub(r, vec2_list[ie], vec2_list[hull[m]]);
            vec2_sub(v, vec2_list[j], vec2_list[hull[m]]);
            c = Vec2.cross(r, v);
            if (c < 0) {
                ie = j;
            }

            // Collinearity check
            if (c === 0 && vec2_lengthSq(v) > vec2_lengthSq(r)) {
                ie = j;
            }
        }

        ++m;
        ih = ie;
    } while (ie !== i0);

    // Copy vertices
    var newPoints = [];
    for (i = 0; i < m; ++i) {
        newPoints.push(vec2_list[hull[i]]);
    }

    return newPoints;
}
/**
 * @param {AABB2} aabb2
 * @return {Polygon}
 */
function fromAABB(aabb2) {
    var out = new Array(4);
    out[0] = [aabb2[0], aabb2[1]];
    out[1] = [aabb2[0], aabb2[3]];
    out[2] = [aabb2[2], aabb2[3]];
    out[3] = [aabb2[2], aabb2[1]];

    return out;
}
/**
 * @param {Rectangle} rect
 * @return {Polygon}
 */
function fromRectangle(rect) {
    var out = new Array(4);
    out[0] = [rect[0][0], rect[0][1]];
    out[1] = [rect[0][0], rect[1][1]];
    out[2] = [rect[1][0], rect[1][1]];
    out[3] = [rect[1][0], rect[0][1]];

    return out;
}
/**
 * Create a polygon, the polygon is a line
 * @todo extrude this line
 * @param {Beizer} curve
 * @param {Number} npoints
 * @return {Polygon}
 */
function fromBeizer(curve, npoints) {
    return beizer_getPoints(curve, npoints);
}
/**
 * Create a polygon from a circle
 * start_radians rotate the given polygon
 * @param {Circle} circle
 * @param {Number} npoints
 * @param {Number} start_radians
 * @return {Polygon}
 */
function fromCircle(circle, npoints, start_radians) {
    var i = start_radians,
        max = Math.TWO_PI + start_radians,
        angle = Math.TWO_PI / npoints,
        out = [],
        cx = circle[0][0],
        cy = circle[0][1],
        r = circle[1],
        c,
        s;

    for (; i < max; i += angle) {
        c = cos(i);
        s = sin(i);
        out.push([cx + c * r, cy + s * r]);
    }

    return out;
}
/**
 *
 * @param {Polygon} out
 * @param {Polygon} poly
 * @param {Vec2} vec2
 * @return {Polygon}
 */
function translate(out, poly, vec2) {
    var len = poly.length - 1;

    x = vec2[0];
    y = vec2[1];

    do {
        p = poly[len];
        o = out[len] = out[len] || [0, 0];
        o[0] = p[0] + x;
        o[1] = p[1] + y;
    } while (len--);

    return out;
}
var cfactor,
    sfactor;
/**
 *
 * @param {Polygon} out
 * @param {Polygon} poly
 * @param {Number} radians
 * @return {Polygon}
 */
function rotate(out, poly, radians) {
    if (out.length > poly.length) {
        out.splice(poly.length);
    }

    var len = poly.length - 1;

    cfactor = cos(radians);
    sfactor = sin(radians);

    do {
        p = poly[len];
        o = out[len] = out[len] || [0, 0];
        x = p[0];
        y = p[1];

        o[0] = x * cfactor - y * sfactor;
        o[1] = x * sfactor + y * cfactor;
    } while (len--);

    return out;
}
/**
 *
 * @param {Polygon} out
 * @param {Polygon} poly
 * @param {Number} radians
 * @return {Polygon}
 */
function edges(out, poly) {
    if (out.length > poly.length) {
        out.splice(poly.length);
    }

    var i = 0,
        len = poly.length,
        lenm1 = len - 1;

    // Calculate the edges/normals
    for (; i < len; i++) {
        vec2_sub(out[i] = out[i] || [0, 0], poly[i < lenm1 ? i + 1 : 0], poly[i]);
    }

    return out;
}
/**
 *
 * @param {Polygon} out
 * @param {Polygon} edges
 * @return {Polygon}
 */
function normals(out, edges) {
    var i = 0,
        len = edges.length;

    if (out.length > edges.length) {
        out.splice(edges.length);
    }

    for (; i < len; i++) {
        out[i] = out[i] || [0, 0];
        vec2_perp(out[i], edges[i]);
        vec2_normalize(out[i], out[i]);
    }

    return out;
}

var c_aux = [0, 0],
    c_aux2 = [0, 0];
/**
 *
 * @param {Vec2} out_vec2
 * @param {Polygon} poly
 * @return {Vec2}
 */
function centroid(out_vec2, poly) {
    var i = 0,
        len = poly.length;

    sum = 0;
    out_vec2[0] = 0;
    out_vec2[1] = 1;

    for (; i < len; ++i) {
        c_aux[0] = poly[i][0];
        c_aux[1] = poly[i][1];
        f = (i === len) ? 0 : i;
        c_aux2[0] = poly[f][0];
        c_aux2[0] = poly[f][1];

        cross = vec2_cross(c_aux, c_aux2);

        sum += cross;
        vec2_add(c_aux, c_aux, c_aux2);
        vec2_scale(c_aux, c_aux, cross);
        vec2_add(out_vec2, out_vec2, c_aux);
    }

    return vec2_scale(out_vec2, out_vec2, 1 / (3 * sum));
}
var vec2_centroid = [0, 0];
/**
 *
 * @param {Polygon} out
 * @param {Polygon} poly
 * @return {Polygon}
 */
function recenter(out, poly) {
    var i = 0,
        len = poly.length;

    if (out.length > poly.length) {
        out.splice(poly.length);
    }

    centroid(vec2_centroid, poly);
    var x = vec2_centroid[0],
        y = vec2_centroid[1];

    for (; i < len; ++i) {
        out[i] = out[i] || [0, 0]; // create if needed...
        out[i][0] += x;
        out[i][1] += y;
    }
}
/*
* @TODO review, this doesn't seems to be right!
* Get the circumeter of polygon
* @param {Complex[]} p The polygon
function circumcenter(out, poly) {
    var circ = 0, i = 1;
    for (; i < poly.length; i++) {
      var dx = poly[i][0] - poly[i - 1][0];
      var dy = poly[i][1] - poly[i - 1][1];
      circ += sqrt(dx * dx + dy * dy);
    }
    return circ;
},
*/

/**
 *
 * @param {Polygon} poly
 * @return {Number}
 */
function area(poly) {
    var value = 0,
        i = 0,
        len = poly.length;

    for (; i < len; ++i) {
        f = (i === len) ? 0 : i;
        value -= (poly[i][0] * poly[f][0]) - (poly[i][1] * poly[f][1]);
    }

    return value * 0.5;
}

/**
 *
 * @param {Polygon} out
 * @param {Polygon} poly
 * @param {Matrix23} m2d
 * @return {Polygon}
 */
function transform(out, poly, m2d) {
    var i = 0,
        len = poly.length;

    if (out.length > poly.length) {
        out.splice(poly.length);
    }

    for (; i < len; ++i) {
        out[i] = out[i] || [0, 0];
        Matrix23.transform(out[i], m2d, poly[i]);
    }

    return out;
}

/**
 *
 * @param {Polygon} poly
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function isVec2Inside(poly, vec2) {
    var i = 0,
        len = poly.length,
        j = len - 1,
        c = false;

    for (; i < len; j = i++) {
        if ((poly[i][1] >= vec2[1]) !== (poly[j][1] >= vec2[1]) &&
            (vec2[0] <= (poly[j][0] - poly[i][0]) * (vec2[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
        ) {
            c = !c;
        }
    }

    return c;
}

/**
 * Compute farthest polygon point in particular direction.
 * Return the index in the polygon and a clone in out_vec2
 *
 * @param {Vec2} out_vec2
 * @param {Polygon} poly
 * @param {Vec2} vec2_dir
 * @return {Number} index in the current poly
 */
function furthestPoint(out_vec2, poly, vec2_dir) {
    var idx,
        i,
        max,
        max_dot = -Infinity,
        current_dot;

    for (i = 0, max = poly.length; i < max; ++i) {
        current_dot = Vec2.dot(poly[i], vec2_dir);
        if (current_dot > max_dot) {
            idx = i;
            max_dot = current_dot;
        }
    }

    out_vec2[0] = poly[idx][0];
    out_vec2[1] = poly[idx][1];

    return idx;
}

var fm_nd = [0, 0],
    fm_a = [0, 0],
    fm_b = [0, 0];

/*
 * furthest Point in the Minkowski diff between A and B polygons for a given direction
 *
 * @param {Vec2} out_vec2
 * @param {Polygon} poly_a
 * @param {Polygon} poly_b
 * @param {Vec2} vec2_dir
 * @return {Vec2}
 */
function furthestMinkowski(out_vec2, poly_a, poly_b, vec2_dir) {
    // furthest point in poly_a for vec2_dir
    furthestPoint(fm_a, poly_a, vec2_dir);

    // furthest point in poly_b for -vec2_dir
    vec2_negate(fm_nd, vec2_dir);
    furthestPoint(fm_b, poly_b, fm_nd);

    return vec2_sub(out_vec2, fm_a, fm_b);
}

/**
 * Calculate Minkowski Difference
 *
 * @param {Polygon} poly_a
 * @param {Polygon} poly_b
 * @return {Polygon} a new one, because the size is random
 */
function MinkowskiDifference(poly_a, poly_b) {
    var i,
        imax = poly_a.length,
        j,
        jmax = poly_b.length,
        scale = imax * jmax,
        minkSum = new Array(scale),
        idx = 0;

    for (i = 0; i < imax; ++i) {
        for (j = 0; j < jmax; ++j) {
            minkSum[idx++] = [poly_a[i][0] - poly_b[j][0], poly_a[i][1] - poly_b[j][1]];
        }
    }

    return createConvexHull(minkSum);
}
/**
 * @source http://www.gamedev.net/topic/342822-moment-of-inertia-of-a-polygon-2d/
 * @source http://www.physicsforums.com/showthread.php?t=25293&page=2&pp=15
 * @param {Polygon} poly
 * @param {Number} mass
 */
function momentOfInertia(poly, mass) {
    var denom = 0.0,
        numer = 0.0,
        len = poly.length,
        i = 0,
        j = len - 1,
        p0,
        p1,
        a,
        b;

    for (; i < len; j = i++) {
        p0 = poly[j];
        p1 = poly[i];
        a = abs(vec2_crossLength(p0, p1));
        b = vec2_dot(p1, p1) + vec2_dot(p1, p0) + vec2_dot(p0, p0);
        denom += a * b;
        numer += a;
    }
    return (mass / 6.0) * (denom / numer);
}

/**
 * @source http://paulbourke.net/geometry/polygonmesh/
 * @param {Polygon} poly
 */
function isConvex(poly) {
    var len = poly.length,
        i,
        j = 1,
        k = 2,
        flag = 0,
        z;

    if (len < 3) {
        return -1;
    }

    for (i = 0; i < len; ++i, ++j, ++k) {
        j = j % len;
        k = k % len;

        z  = (poly[j][0] - poly[i][0]) * (poly[k][1] - poly[j][1]) -
             (poly[j][1] - poly[i][1]) * (poly[k][0] - poly[j][0]);
        if (z < 0) {
            flag |= 1;
        } else if (z > 0) {
            flag |= 2;
        }

        if (flag === 3) {
            return false;
        }
    }

    if (flag !== 0) {
       return true;
    }

    return -1;
}

/**
 * @param {Polygon} poly
 */
function toString(poly) {
    var vec2s = [],
        i,
        len = poly.length;

    for (i = 0; i < len; ++i) {
        vec2s.push(Vec2.toString(poly[i]));
    }

    return "{" + vec2s.join(",") + "}";
}

/**
 * @class Polygon
 */
var Polygon = {
    create: create,
    createConvexHull: createConvexHull,
    fromAABB: fromAABB,
    fromRectangle: fromRectangle,
    fromBeizer: fromBeizer,
    fromCircle: fromCircle,
    translate: translate,
    isConvex: isConvex,
    rotate: rotate,
    centroid: centroid,
    recenter: recenter,
    //circumcenter: circumcenter,
    area: area,
    transform: transform,

    normals: normals,
    edges: edges,

    isVec2Inside: isVec2Inside,
    furthestPoint: furthestPoint,
    furthestMinkowski: furthestMinkowski,
    MinkowskiDifference: MinkowskiDifference,

    //physics
    momentOfInertia: momentOfInertia,

    toString: toString
};

module.exports = Polygon;

},{"./beizer.js":4,"./matrix23.js":19,"./vec2.js":30}],26:[function(require,module,exports){
/*
 * Stability: 1 (Only additions & fixes)
 *
 * Rectangle is represented as a three coordinates array
 * [a: Vec2, b: Vec2, normalized: Boolean]
 */

var Vec2 = "undefined" === typeof exports ? window.Vec2 : require("./vec2.js"),
    vec2_distance = Vec2.distance,
    max = Math.max,
    min = Math.min,
    aux_vec2_1 = [0, 0],
    aux_vec2_2 = [0, 0],
    a = 0,
    b = 0;
/**
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @return {Rectangle}
 */
function create(x1, y1, x2, y2) {
    var out = [[x1, y1], [x2, y2], false];
    normalize(out, out);
    return out;
}
/**
 * @param {AABB2} aabb2
 * @return {Rectangle}
 */
function fromBB(aabb2) {
    return create(aabb2[0], aabb2[1], aabb2[2], aabb2[3]);
}
/**
 * @return {Rectangle}
 */
function zero() {
    return [[0, 0], [0, 0], true];
}
/**
 * @param {Rectangle} rect
 * @return {Rectangle}
 */
function clone(rect) {
    return [[rect[0][0], rect[0][1]], [rect[1][0], rect[1][1]], rect[2]];
}
/**
 * @param {Rectangle} out
 * @param {Rectangle} rect
 * @return {Rectangle}
 */
function copy(out, rect) {
    out[0][0] = rect[0][0];
    out[0][1] = rect[0][1];

    out[1][0] = rect[1][0];
    out[1][1] = rect[1][1];

    out[2] = rect[2];

    return out;
}

/**
 * a -> bottom-left
 * a -> top-right
 *
 * @param {Rectangle} out
 * @param {Rectangle} rect
 * @param {Boolean=} force
 * @return {Rectangle}
 */
function normalize(out, rect, force) {
    force = force || rect[2] === false || false;

    if (!force) {
        copy(out, rect);
        return out;
    }

    a = min(rect[0][0], rect[1][0]);
    b = max(rect[0][0], rect[1][0]);

    out[0][0] = a;
    out[1][0] = b;

    a = min(rect[0][1], rect[1][1]);
    b = max(rect[0][1], rect[1][1]);

    out[0][1] = a;
    out[1][1] = b;

    out[2] = true;

    return out;
}
/**
 * @param {Vec2} out_vec2
 * @param {Rectangle} rect
 * @return {Vec2}
 */
function center(out_vec2, rect) {
    out_vec2[0] = (rect[0][0] + rect[1][0]) * 0.5;
    out_vec2[1] = (rect[0][1] + rect[1][1]) * 0.5;

    return out_vec2;
}
/**
 * @param {Rectangle} out
 * @param {Rectangle} rect
 * @param {Vec2} vec2
 * @return {Rectangle}
 */
function translate(out, rect, vec2) {
    out[0][0] = rect[0][0] + vec2[0];
    out[0][1] = rect[0][1] + vec2[1];

    out[1][0] = rect[1][0] + vec2[0];
    out[1][1] = rect[1][1] + vec2[1];

    return out;
}
/**
 * @param {Rectangle} rect
 * @param {Rectangle} rect2
 * @return {Number}
 */
function distance(rect, rect2) {
    center(aux_vec2_1, rect);
    center(aux_vec2_2, rect2);

    return vec2_distance(aux_vec2_2, aux_vec2_1);
}
/**
 * @param {Rectangle} rect
 * @return {Number}
 */
function area(rect) {
    a = rect[0][0] - rect[1][0];
    b = rect[0][1] - rect[1][1];
    a *= b;

    return a < 0 ? -a : a; //needed id normalized ?
}
/**
 * @param {Rectangle} rect
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function isVec2Inside(rect, vec2) {
    return rect[0][0] < vec2[0] && rect[1][0] > vec2[0] && rect[0][1] < vec2[1] && rect[1][1] > vec2[1];
}
/**
 * @param {Rectangle} rect
 * @return {Number}
 */
function perimeter(rect) {
    return (rect[1][0] - rect[0][0]) * 2 + (rect[1][1] - rect[0][1]) * 2 ;
}
/**
 * @param {Rectangle} rect
 * @param {Number} mass
 */
function momentOfInertia(rect, mass) {
    var w = rect[1][0] - rect[0][0],
        h = rect[1][1] - rect[0][1];

    // X/12
    return mass * (h*h + w*w) * 0.08333333333333333;
}
/**
 * @class Rectangle
 */
var Rectangle = {
    fromBB: fromBB,
    create: create,
    zero: zero,
    clone: clone,
    copy: copy,
    normalize: normalize,
    center: center,
    translate: translate,
    distance: distance,
    area: area,
    isVec2Inside: isVec2Inside,
    perimeter: perimeter,

    //physics
    momentOfInertia: momentOfInertia,
};


module.exports = Rectangle;
},{"./vec2.js":30}],27:[function(require,module,exports){
/**
 * Segment2 is represented by a 4 coordinates array
 * [x1:Number, y1:Number, x2:Number, y2:Number] normalized so x1 < x2
 */

var Vec2 = require("./vec2.js"),
    vec2_rotate = Vec2.rotate,
    aux_vec2 = [0, 0],
    aux,
    within = Vec2.$within,
    sqrt = Math.sqrt,
    atan2 = Math.atan2,
    PI = Math.PI,
    near = Math.near,
    __x,
    __y,
    u = 0;
/**
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @return {Segment2}
 */
function create(x1, y1, x2, y2) {
    if (x1 < x2) {
        return [x1, y1, x2, y2];
    }

    return [x2, y2, x1, y1];
}
/**
 * @param {Segment2} out
 * @param {Segment2} seg2
 * @return {Segment2}
 */
function normalize(out, seg2) {
    if (seg2[0] < seg2[1]) {
        out[0] = seg2[0];
        out[1] = seg2[1];
        out[2] = seg2[2];
        out[3] = seg2[3];
    } else {
        var x = seg2[0],
            y = seg2[1];

        out[0] = seg2[2];
        out[1] = seg2[3];
        out[2] = x;
        out[3] = y;
    }

    return out;
}
/**
 * @param {Segment2} seg2
 * @return {Segment2}
 */
function clone(seg2) {
    return [seg2[0], seg2[1], seg2[2], seg2[3]];
}
/**
 * @param {Segment2} out
 * @param {Segment2} seg2
 * @return {Segment2}
 */
function copy(out, seg2) {
    out[0] = seg2[0];
    out[1] = seg2[1];
    out[2] = seg2[2];
    out[3] = seg2[3];

    return out;
}
/**
 * @param {Segment2} out
 * @param {Segment2} seg2
 * @param {Vec2} vec2
 * @return {Segment2}
 */
function translate(out, seg2, vec2) {
    out[0] = seg2[0] + vec2[0];
    out[1] = seg2[1] + vec2[1];
    out[2] = seg2[2] + vec2[0];
    out[3] = seg2[3] + vec2[1];

    return out;
}
/**
 * @param {Segment2} seg2
 * @return {Number}
 */
function length(seg2) {
    __x = seg2[2] - seg2[0];
    __y = seg2[3] - seg2[1];

    return sqrt(__x * __x + __y * __y);
}
/**
 * @param {Segment2} seg2
 * @return {Number}
 */
function sqrLength(seg2) {
    __x = seg2[2] - seg2[0];
    __y = seg2[3] - seg2[1];

    return __x * __x + __y * __y;
}
/**
 * @param {Vec2} out_vec2
 * @param {Segment2} seg2
 * @return {Vec2}
 */
function midPoint(out_vec2, seg2) {
    out_vec2[0] = (seg2[0] + seg2[2]) * 0.5;
    out_vec2[1] = (seg2[1] + seg2[3]) * 0.5;

    return out_vec2;
}
/**
 * @param {Segment2} seg2
 * @return {Number}
 */
function slope(seg2) {
    return (seg2[0] - seg2[2]) / (seg2[1] - seg2[3]);
}
/**
 * @param {Segment2} seg2
 * @return {Number}
 */
function angle(seg2) {
    return atan2(seg2[3] - seg2[1], seg2[2] - seg2[0]);
}
/**
 * @param {Segment2} seg2
 * @param {Vec2} vec2
 * @return {Number}
 */
function cross(seg2, vec2) {
    return (seg2[0] - vec2[0]) * (seg2[3] - vec2[1]) - (seg2[1] - vec2[1]) * (seg2[2] - vec2[0]);
}
/**
 * @param {Segment2} seg2
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function isCollinear(seg2, vec2) {
    return near((seg2[2] - seg2[0]) * (vec2[1] - vec2[1]), (vec2[0] - seg2[0]) * (seg2[3] - seg2[1]));
}
/**
 * @todo do it!
 * @return {Boolean}
 * @param {Segment2} seg2
 * @param {Segment2} seg2_2
 */
function isParallel(seg2, seg2_2) {
    throw new Error("todo");
}
/**
 * @param {Segment2} seg2
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function isVec2Inside(seg2, vec2) {
    return isCollinear(seg2, vec2) && within(seg2[0], seg2[1], vec2[0], vec2[1], seg2[2], seg2[3]);
}
/**
 * @param {Segment2} seg2
 * @param {Vec2} vec2
 * @param {Number=} cached_seg2_min_angle
 * @return {Boolean}
 */
function isAbove(seg2, vec2, cached_seg2_min_angle) {
    aux_vec2[0] = seg2[0];
    aux_vec2[1] = seg2[1];
    angle = Vec2.angleTo(vec2, aux_vec2);

    cached_seg2_min_angle = cached_seg2_min_angle || Segment2.angle(seg2);

    if (cached_seg2_min_angle >= 0) {
        aux = cached_seg2_min_angle;
        cached_seg2_min_angle = cached_seg2_min_angle - PI;
        cache_seg2_angle_max = aux;
        return angle > cached_seg2_min_angle && angle < cache_seg2_angle_max;
    }

    cache_seg2_angle_max = cached_seg2_min_angle + PI;

    return angle < cached_seg2_min_angle || angle > cache_seg2_angle_max;
}
/**
 * @param {Vec2} out_vec2
 * @param {Segment2} seg2
 * @return {Vec2}
 */
function leftNormal(out_vec2, seg2) {
    out_vec2[0] = seg2[2] - seg2[0];
    out_vec2[1] = seg2[3] - seg2[1];

    vec2_rotate(out_vec2, out_vec2, -Math.HALF_PI);

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Segment2} seg2
 * @return {Vec2}
 */
function rightNormal(out_vec2, seg2) {
    out_vec2[0] = seg2[2] - seg2[0];
    out_vec2[1] = seg2[3] - seg2[1];

    vec2_rotate(out_vec2, out_vec2, Math.HALF_PI);

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Segment2} seg2
 * @param {Vec2} vec2
 * @return {Vec2}
 */
function closestPoint(out_vec2, seg2, vec2) {
    return $closestPoint(out_vec2, seg2[0], seg2[1], seg2[2], seg2[3], vec2[0], vec2[1]);
}

/**
 * @todo optimize, "inline the if/else"
 * @param {Vec2} out_vec2
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 * @return {Vec2}
 */
function $closestPoint(out_vec2, x1, y1, x2, y2, x3, y3) {
    __x = x2 - x1;
    __y = y2 - y1;

    u = ((x3 - x1) * __x + (y3 - y1) * __y) / (__x * __x + __y * __y);

    if (u > 1) {
        u = 1;
    } else if (u < 0) {
        u = 0;
    }

    out_vec2[0] = (x1 + u * __x);
    out_vec2[1] = (y1 + u * __y);

    return out_vec2;
}

/**
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 * @return {Boolean}
 */
function $collinear(x1, y1, x2, y2, x3, y3) {
    //strict return (x2 - x1) * (y3 - y1) === (x3 - x1) * (y2 - y1);
    return near((x2 - x1) * (y3 - y1), (x3 - x1) * (y2 - y1));
}
/**
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 * @return {Boolean}
 */
function $inside(x1, x2, y1, y2, x3, y3) {
    return $collinear(x1, x2, y1, y2, x3, y3) && within(x1, x2, x3, y3, y1, y2);
}

/**
 * @class Segment2
 */
var Segment2 =  {
    create: create,
    clone: clone,
    copy: copy,
    normalize: normalize,
    translate: translate,
    length: length,
    sqrLength: sqrLength,
    midPoint: midPoint,
    slope: slope,
    angle: angle,
    cross: cross,
    closestPoint: closestPoint,
    isCollinear: isCollinear,
    isParallel: isParallel,
    isVec2Inside: isVec2Inside,
    isAbove: isAbove,
    leftNormal: leftNormal,
    rightNormal: rightNormal,

    // alias
    lengthSq: sqrLength,
    contains: isVec2Inside,

    $inside: $inside,
    $collinear: $collinear,
    $closestPoint: $closestPoint
};


module.exports = Segment2;
},{"./vec2.js":30}],28:[function(require,module,exports){
/*
 * Stability: 2 (fixes / performance improvements)
 *
 * @TODO expand all function, do not generate with loops
 */

var array = require("array-enhancements"),
    Beizer = require("./beizer.js"),
    beizer_cubic = Beizer.cubic,
    beizer_quadric = Beizer.quadric,
    beizer_solve = Beizer.solve,
    pow = Math.pow,
    sin = Math.sin,
    acos = Math.acos,
    cos = Math.cos,
    PI = Math.PI,
    t = {},
    k,
    Transitions = {},
    CHAIN = 1,
    STOP = 2,
    IGNORE = 3,
    CANCEL = 4;


function createCubic(cp1x, cp1y, cp2x, cp2y) {
    var curve = beizer_cubic(0, 0, cp1x, cp1y, cp2x, cp2y, 1, 1),
        aux = [0, 0];

    return function(t) {
        beizer_solve(aux, curve, t);

        return aux[1];
    }
}

function createQuadric(cp1x, cp1y) {
    var curve = beizer_quadric(0, 0, cp1x, cp1y, 1, 1),
        aux = [0, 0];

    return function(t) {
        beizer_solve(aux, curve, t);

        return aux[1];
    }
}

function Pow(pos, x) {
    return pow(pos, (x && x[0]) || 6);
}

function Expo(pos) {
    return pow(2, 8 * (pos - 1));
}

function Circ(pos) {
    return 1 - sin(acos(pos));
}

function Sine(pos) {
    return 1 - cos(pos * PI / 2);
}

function Back(pos, x) {
    x = (x && x[0]) || 1.618;
    return pow(pos, 2) * ((x + 1) * pos - x);
}

function Bounce(pos) {
    var value, a, b;
    for (a = 0, b = 1; true; a += b, b /= 2) {
        if (pos >= (7 - 4 * a) / 11) {
            value = b * b - pow((11 - 6 * a - 11 * pos) / 4, 2);
            break;
        }
    }
    return value;
}

function Elastic(pos, x) {
    return pow(2, 10 * --pos) * cos(20 * pos * PI * ((x && x[0]) || 1) / 3);
}



/**
 * Just return what you sent
 * @param {Number} pos
 */
function linear(pos) {
    return pos;
}

/**
 * Wrap your transaction with In/Out/InOut modifiers.
 * @param {String} name
 * @param {Function} transition
 */
function create(name, transition) {

    //Transitions[name] = function (pos) {
    //    return transition(pos);
    //};
    //Transitions[name + "In"] = Transitions[name];

    Transitions[name] = transition;

    Transitions[name + "In"] = transition;

    Transitions[name + "Out"] = function (pos) {
        return 1 - transition(1 - pos);
    };

    Transitions[name + "InOut"] = function (pos) {
        return (pos <= 0.5 ? transition(2 * pos) : (2 - transition(2 * (1 - pos)))) / 2;
    };
}

t = {
    Pow: Pow,
    Expo: Expo,
    Circ: Circ,
    Sine: Sine,
    Back: Back,
    Bounce: Bounce,
    Elastic: Elastic
};

for (k in t) {
    create(k, t[k]);
}

["Quad", "Cubic", "Quart", "Quint"].forEach(function (transition, i) {
    create(transition, function (p) {
        return pow(p, i + 2);
    });
});

// tween function

function _def_render(obj, prop, value) {
    obj[prop] = value;
}

function _def_parser(obj, prop) {
    return parseFloat(obj[prop], 10);
}

function _def_factor(k0, k1, rfactor) {
    return ((k1 - k0) * rfactor) + k0;
}

Transitions.LINK_CHAIN  = CHAIN;
Transitions.LINK_STOP   = STOP;
Transitions.LINK_IGNORE = IGNORE;
Transitions.LINK_CANCEL = CANCEL;

function _normalize(obj, input) {
    //get all props

    var keys = Object.keys(input).sort(function (a, b) { return parseFloat(a) - parseFloat(b); }),
        i,
        j,
        prop,
        key,
        fkey,
        prop_list = [],
        props = {},
        last;

    for (i = 0; i < keys.length; ++i) {
        prop_list = array.add(prop_list, Object.keys(input[keys[i]]));
    }
    prop_list = array.unique(prop_list);

    for (j = 0; j < prop_list.length; ++j) {
        prop = prop_list[j];
        props[prop] = {};

        for (i = 0; i < keys.length; ++i) {
            key = keys[i];

            fkey = parseFloat(keys[i]);

            // first of the sorted list and is not 0%
            // set current value
            if (i === 0 && key !== "0%") {
                props[prop][0] = obj[prop];
            }

            if (input[key][prop] !== undefined) {
                props[prop][fkey] = last = input[key][prop];
            }
        }

        // check that has 100% if not set the last known value
        if (props[prop]["100"] === undefined) {
            props[prop][100] = last;
        }

    }

    return props;
}

/**
 * Animate object properties.
 *
 * *obj* must be writable or at least have defined $__tween
 * *prop* property name to animate
 * *values* keys are numbers from 0 to 100, values could be anything
 * *ioptions*
 * **mandatory**
 *   * **time**: <number> in ms
 *
 * **optional**
 *   * **transition** Transition.XXX, or a valid compatible function Default: linear
 *   * **link** Transition.LINK_XXX Default: CHAIN
 *   * **render** function(obj, property, new_value) {}
 *   * **parser** function(obj, property) { return <value>; }
 *   * **tickEvent** <string> event name Default: "tick"
 *   * **endEvent** <string> event name Default: "animation:end"
 *   * **startEvent** <string> event name Default: "animation:star"
 *   * **chainEvent** <string> event name Default: "animation:chain"
 *
 * @param {Object} obj
 * @param {String|Number} prop
 * @param {Array|Object} values
 * @param {Object} ioptions
 */
function animate(obj, prop, values, ioptions) {
    // lazy init
    obj.$__tween = obj.$__tween || {};

    //console.log("options", JSON.stringify(options), JSON.stringify(values));
    // <debug>
    if ("function" !== typeof obj.on) {
        throw new Error("obj must be an event-emitter");
    }
    if ("function" !== typeof obj.removeListener) {
        throw new Error("obj must be an event-emitter");
    }
    if ("number" !== typeof ioptions.time) {
        throw new Error("options.time is mandatory");
    }
    // </debug>

        //soft clone and defaults
    var options = {
            render: ioptions.render || _def_render,
            parser: ioptions.parser || _def_parser,
            applyFactor: ioptions.applyFactor || _def_factor,
            transition: ioptions.transition || Transitions.linear,
            link: ioptions.link || CHAIN,
            tickEvent: ioptions.tickEvent || "tick",
            endEvent: ioptions.endEvent || "animation:end",
            startEvent: ioptions.startEvent || "animation:start", // first emit
            chainEvent: ioptions.chainEvent || "animation:chain",
            time: ioptions.time,
            start: Date.now(),
            current: 0
        },
        chain_fn,
        kvalues = Object.keys(values),
        fvalues = kvalues.map(function (val) { return parseFloat(val) * 0.01; }),
        update_fn;

    //console.log("options", JSON.stringify(options), JSON.stringify(values));

    update_fn = function (delta) {
        //console.log(prop, "tween @", delta, options, values);
        if (!delta) {
            throw new Error("trace");
        }
        options.current += delta;



        var factor = options.current / options.time,
            tr_factor,
            i,
            found = false,
            max = kvalues.length,
            k0,
            k1,
            rfactor;

        //clamp
        if (factor > 1) { // end
            factor = 1;
            tr_factor = 1;
        } else {
            tr_factor = options.transition(factor);
        }

        for (i = 0; i < max && !found; ++i) {
            k0 = fvalues[i];
            if (k0 <= tr_factor) {
                if (i === max - 1) {
                    // last element
                    found = true;
                    k0 = fvalues[i - 1];
                    k1 = fvalues[i];
                } else {
                    k1 = fvalues[i + 1];

                    if (k1 > tr_factor) {
                        found = true;
                    }
                }


                if (found === true) {
                    //console.log(prop, "ko", k0, "k1", k1);
                    //console.log(prop, tr_factor);

                    if (tr_factor === 1) {
                        options.render(obj, prop, values["100"]);

                        // this is the end, my only friend, the end...
                        obj.removeListener(options.tickEvent, obj.$__tween[prop]);
                        delete obj.$__tween[prop];
                        obj.emit(options.endEvent, options);
                    } else {
                        rfactor = (tr_factor - k0) / (k1 - k0);
                        //console.log(prop, i, rfactor);

                        //console.log(prop, rfactor, "k0", values[k0], "k1", values[k1]);

                        options.render(obj, prop,
                            options.applyFactor(values[kvalues[i]], values[kvalues[i + 1]], rfactor)
                            );
                    }
                }
            }
        }
    };

    if (obj.$__tween[prop]) {
        // link will told us what to do!
        switch (options.link) {
        case IGNORE:
            return IGNORE;
        case CHAIN:

            chain_fn = function () {
                if (!obj.$__tween[prop]) {
                    obj.$__tween[prop] = update_fn;
                    obj.on(options.tickEvent, obj.$__tween[prop]);
                    obj.removeListener(options.endEvent, chain_fn);
                }
            };

            obj.on(options.endEvent, chain_fn);
            obj.emit(options.chainEvent, options);

            return CHAIN;
        case STOP:
            obj.removeListener(options.tickEvent, obj.$__tween[prop]);
            delete obj.$__tween[prop];

            return STOP;
        case CANCEL:
            obj.removeListener(options.tickEvent, obj.$__tween[prop]);
            delete obj.$__tween[prop];
            // and attach!

            obj.$__tween[prop] = update_fn;
            obj.on(options.tickEvent, obj.$__tween[prop]);
            break;
        }
    } else {
        obj.$__tween[prop] = update_fn;
        obj.on(options.tickEvent, obj.$__tween[prop]);
    }



    return true;
}

/**
 * @param {Object} obj
 * @param {Object} params
 * @param {Object} options
 */
function tween(obj, params, options) {
    // <debug>
    if (!params.hasOwnProperty("100%")) {
        throw new Error("100% params must exists");
    }

    if ("function" !== typeof obj.on) {
        throw new Error("obj must be an event-emitter");
    }
    if ("function" !== typeof obj.removeListener) {
        throw new Error("obj must be an event-emitter");
    }
    if ("number" !== typeof options.time) {
        throw new Error("options.time is mandatory");
    }
    // </debug>

    options = options || {};
    // set defaults
    options.render = options.render || _def_render;
    options.parser = options.parser || _def_parser;
    options.transition = options.transition || Transitions.linear;
    options.link = options.link || CHAIN;
    options.tick = options.tick || "tick";

    // set config
    obj.$__tween = obj.$__tween || {};

    var plist = _normalize(obj, params),
        i;

    // animate each property
    for (i in plist) {
        Transitions.animate(obj, i, plist[i], options);
    }

}


Transitions.tween = tween;
Transitions.animate = animate;
Transitions.linear = linear;
Transitions.create = create;

Transitions.createCubic = createCubic;
Transitions.createQuadric = createQuadric;

module.exports = Transitions;
},{"./beizer.js":4,"array-enhancements":32}],29:[function(require,module,exports){
/**
 * Stability: 2 (fixes / performance improvements)
 *
 * Triangle is represented as a three coordinates array
 * [A:Vec2, B:Vec2, C:Vec2]
 */


var Vec2 = require("./vec2.js"),
    vec2_midpoint = Vec2.midPoint,
    vec2_distance = Vec2.distance,
    vec2_pow = Vec2.pow,
    vec2_dot = Vec2.dot,
    DIV3 = 1 / 3,
    ah = [0, 0],
    bh = [0, 0],
    ch = [0, 0],
    dab = [0, 0],
    dbc = [0, 0],
    dca = [0, 0],
    det = 0,
    a = 0,
    b = 0,
    c = 0;
/**
 * A(x1, y1), B(x2, y2), C(x3, y3)
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 * @return {Triangle}
 */
function create(x1, y1, x2, y2, x3, y3) {
    var out = [[x1, y1], [x2, y2], [x3, y3], false];

    //normalize(out, out);
    return out;
}
/**
 * @return {Triangle}
 */
function zero() {
    return [[0, 0], [0, 0], [0, 0], true];
}
/**
 * @param {Triangle} tri
 * @return {Triangle}
 */
function clone(tri) {
    return [[tri[0][0], tri[0][1]], [tri[1][0], tri[1][1]], [tri[2][0], tri[2][1]], tri[3]];
}
/**
 * @param {Triangle} out_tri
 * @param {Triangle} tri
 * @return {Triangle}
 */
function copy(out_tri, tri) {
    out_tri[0][0] = tri[0][0];
    out_tri[0][1] = tri[0][1];

    out_tri[1][0] = tri[1][0];
    out_tri[1][1] = tri[1][1];

    out_tri[2][0] = tri[2][0];
    out_tri[2][1] = tri[2][1];

    out_tri[3] = tri[3];

    return out_tri;
}

/**
 * @param {Vec2} out_vec2
 * @param {Triangle} tri
 * @return {Vec2}
 */
function abMidPoint(out_vec2, tri) {
    return vec2_midpoint(out_vec2, tri[0], tri[1]);
}
/**
 * @param {Vec2} out_vec2
 * @param {Triangle} tri
 * @return {Vec2}
 */
function bcMidPoint(out_vec2, tri) {
    return vec2_midpoint(out_vec2, tri[1], tri[2]);
}
/**
 * @param {Vec2} out_vec2
 * @param {Triangle} tri
 * @return {Vec2}
 */
function caMidPoint(out_vec2, tri) {
    return vec2_midpoint(out_vec2, tri[2], tri[0]);
}
/**
 * @param {Triangle} out
 * @param {Triangle} tri
 * @return {Triangle}
 */
function midTriangle(out, tri) {
    abMidPoint(out[0], tri);
    bcMidPoint(out[1], tri);
    caMidPoint(out[2], tri);

    return out;

}
/**
 * @param {Triangle} tri
 * @return {Number}
 */
function perimeter(tri) {
    return vec2_distance(tri[0], tri[1]) +
        vec2_distance(tri[1], tri[2]) +
        vec2_distance(tri[2], tri[0]);
}

/**
 * @param {Vec2} out_vec2
 * @param {Triangle} tri
 * @return {Vec2}
 */
function centroid(out_vec2, tri) {
    out_vec2[0] = (tri[0][0] + tri[1][0] + tri[2][0]) * DIV3;
    out_vec2[1] = (tri[0][1] + tri[1][1] + tri[2][1]) * DIV3;

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Triangle} tri
 * @return {Vec2}
 */
function incenter(out_vec2, tri) {
    a = Vec2.distance(tri[1], tri[2]);
    b = Vec2.distance(tri[2], tri[0]);
    c = Vec2.distance(tri[0], tri[1]);

    out_vec2[0] = (a * tri[0][0] + b * tri[1][0] + c * tri[2][0]) * DIV3;
    out_vec2[1] = (a * tri[0][1] + b * tri[1][1] + c * tri[2][1]) * DIV3;

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Triangle} tri
 * @return {Vec2}
 */
function circumcenter(out_vec2, tri) {
    var bx = tri[1][0] - tri[0][0],
        by = tri[1][1] - tri[0][1],
        bl = bx * bx + by * by,
        cx = tri[2][0] - tri[0][0],
        cy = tri[2][1] - tri[0][1],
        cl = cx * cx + cy * cy,
        d = 2 * (bx * cy - by * cx),
        x = cy * bl - by * cl,
        y = bx * cl - cx * bl;

    out_vec2[0] = x / d + tri[0][0];
    out_vec2[1] = y / d + tri[0][1];

    return out_vec2;
}
/**
 * @param {Triangle} tri
 * @return {Number}
 */
function area(tri) {
    dab = Vec2.min(dbc, tri[1], tri[0]);
    dbc = Vec2.min(dbc, tri[2], tri[0]);

    return (dbc[1] * dab[0] - dbc[0] * dab[1]) * 0.5;
}

/**
 * @param {Triangle} out
 * @param {Triangle} tri
 * @param {Vec2} vec2
 * @return {Triangle}
 */
function translate(out, tri, vec2) {
    out[0][0] = tri[0][0] + vec2[0];
    out[0][1] = tri[0][1] + vec2[1];

    out[1][0] = tri[1][0] + vec2[0];
    out[1][1] = tri[1][1] + vec2[1];

    out[2][0] = tri[2][0] + vec2[0];
    out[2][1] = tri[2][1] + vec2[1];

    return out;
}

var ac = [0, 0],
    ab = [0, 0],
    av = [0, 0],
    dot00,
    dot01,
    dot02,
    dot11,
    dot12,
    invDenom,
    u,
    v;

/**
 * @param {Triangle} tri
 * @param {Vec2} vec2
 * @return {Boolean}
 */
function isVec2Inside(tri, vec2) {

    // Compute vectors
    // ac = C - A
    Vec2.sub(ac, tri[2], tri[0]);
    // ab = B - A
    Vec2.sub(ab, tri[1], tri[0]);
    // av = P - A
    Vec2.sub(av, vec2, tri[0]);

    // Compute dot products
    dot00 = vec2_dot(ac, ac)
    dot01 = vec2_dot(ac, ab)
    dot02 = vec2_dot(ac, av)
    dot11 = vec2_dot(ab, ab)
    dot12 = vec2_dot(ab, av)

    // Compute barycentric coordinates
    invDenom = 1 / (dot00 * dot11 - dot01 * dot01)
    u = (dot11 * dot02 - dot01 * dot12) * invDenom
    v = (dot00 * dot12 - dot01 * dot02) * invDenom

    // Check if point is in triangle
    return (u >= 0) && (v >= 0) && (u + v < 1);
}

/**
 * @class Triangle
 */
var Triangle = {
    create: create,
    zero: zero,
    clone: clone,
    copy: copy,

    abMidPoint: abMidPoint,
    bcMidPoint: bcMidPoint,
    caMidPoint: caMidPoint,
    midTriangle: midTriangle,

    perimeter: perimeter,

    centroid: centroid,
    incenter: incenter,
    circumcenter: circumcenter,
    area: area,
    translate: translate,
    isVec2Inside: isVec2Inside,

    // alias
    center: centroid,
};

module.exports = Triangle;
},{"./vec2.js":30}],30:[function(require,module,exports){
/**
 * Stability: 2 (fixes / performance improvements)
 *
 * Vec2 is represented as a two coordinates array
 * [x:Number, y:Number]
 */

var aux_vec = [0, 0],
    __x = 0,
    __y = 0,
    aux_number1 = 0,
    aux_number2 = 0,
    aux_number3 = 0,

    //cache
    EPS = Math.EPS,
    acos = Math.acos,
    cos  = Math.cos,
    sqrt = Math.sqrt,
    __abs  = Math.abs,
    sin  = Math.sin,
    __min  = Math.min,
    atan2 = Math.atan2,
    __pow = Math.pow,

    HALF_NPI = Math.HALF_NPI,
    HALF_PI = Math.HALF_PI,

    DEG_TO_RAD = Math.DEG_TO_RAD,
    Vec2;

/**
 * Create a Vec2 given two coords
 *
 * @param {Vec2|Number} x
 * @param {Number} y
 * @return {Vec2}
 */
function create(x, y) {
    return [x, y];
}

/**
 * Create a Vec2 given length and angle
 *
 * @param {Number} length
 * @param {Number} degrees
 * @return {Vec2}
 */
function dFromPolar(length, degrees) {
    return fromPolar(length, degrees * DEG_TO_RAD);
}

/**
 * Create a Vec2 given length and angle
 *
 * @param {Number} length
 * @param {Number} radians
 * @return {Vec2}
 */
function fromPolar(length, radians) {
    return [length * sin(radians), length * cos(radians)];
}

/**
 * Create an empty Vec2
 *
 * @return {Vec2}
 */
function zero() {
    return [0, 0];
}

/**
 * Clone given vec2
 *
 * @param {Vec2} v1
 * @return {Vec2}
 */
function clone(v1) {
    return [v1[0], v1[1]];
}

// **********************************************************
// comparison operations
// **********************************************************

/**
 * Returns true if both vectors are equal(same coords)
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Boolean}
 */
function equals(v1, v2) {
    return v2[0] === v1[0] && v2[1] === v1[1];
}
/**
 * Returns true if both vectors are "almost(Math.EPS)" equal
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Boolean}
 */
function equalsEpsilon(v1, v2) {
    aux_number1 = __abs(v2[0] - v1[0]);
    aux_number2 = __abs(v2[1] - v1[1]);

    return aux_number1 < EPS && aux_number2 < EPS;
}
/**
 * Returns true both coordinates of v1 area greater than v2
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Boolean}
 */
function gt(v1, v2) {
    return v2[0] > v1[0] && v2[1] > v1[1];
}
/**
 * Returns true both coordinates of v1 area lesser than v2
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Boolean}
 */
function lt(v1, v2) {
    return v2[0] < v1[0] && v2[1] < v1[1];
}

/**
 * Returns true if the distance between v1 and v2 is less than dist.
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @param {Number} dist
 * @return {Boolean}
 */
function near(v1, v2, dist) {
    // maybe inline
    aux_number1 = sqrDistance(v1, v2);


    return aux_number1 < dist * dist;
}

/**
 * * 0 equal
 * * 1 top
 * * 2 top-right
 * * 3 right
 * * 4 bottom right
 * * 5 bottom
 * * 6 bottom-left
 * * 7 left
 * * 8 top-left
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 */
function compare(v1, v2) {
    var v1x = v1[0],
        v1y = v1[1],
        v2x = v2[0],
        v2y = v2[1];

    if (v2x === v1x && v2y === v1y) {
        return 0;
    }
    if (v2x === v1x) {
        return v2y > v1y ? 1 : 5;
    }
    if (v2y === v1y) {
        return v2x > v1x ? 3 : 7;
    }

    if (v2x > v1x) {
        if (v2y > v1y) {
            return 2;
        }

        if (v2y < v1y) {
            return 4;
        }
    }

    if (v2x < v1x) {
        if (v2y < v1y) {
            return 6;
        }
        if (v2y > v1y) {
            return 8;
        }
    }

    return -1;
}

// **********************************************************
// validation
// **********************************************************
/**
 * The vector does not contain any not number value: ±Infinity || NaN
 *
 * @param {Vec2} v1
 * @return {Boolean}
 */
function isValid(v1) {
    return !(v1[0] === Infinity || v1[0] === -Infinity || isNaN(v1[0]) || v1[1] === Infinity || v1[1] === -Infinity || isNaN(v1[1]));
}
/**
 * Any coordinate is NaN? -> true
 *
 * @param {Vec2} v1
 * @return {Boolean}
 */
function isNaN(v1) {
    return isNaN(v1[0]) || isNaN(v1[1]);
}

// **********************************************************
// first parameter is the output
// **********************************************************

/**
 * Copy v1 into out_vec2
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @return {Vec2}
 */
function copy(out_vec2, v1) {
    out_vec2[0] = v1[0];
    out_vec2[1] = v1[1];

    return out_vec2;
}

/**
 * Negate v1 into out_vec2
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @return {Vec2}
 */
function negate(out_vec2, v1) {
    out_vec2[0] = -v1[0];
    out_vec2[1] = -v1[1];

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @return {Vec2}
 */
function normalize(out_vec2, v1) {
    __x = v1[0];
    __y = v1[1];
    aux_number3 = sqrt(__x * __x + __y * __y);

    if (aux_number3 > EPS) {
        aux_number3 = 1 / aux_number3;
        out_vec2[0] = v1[0] * aux_number3;
        out_vec2[1] = v1[1] * aux_number3;
    }

    return out_vec2;
}
/**
 * Normalize v1 but squared no use sqrt, for performance.
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @return {Vec2}
 */
function normalizeSq(out_vec2, v1) {
    __x = v1[0];
    __y = v1[1];
    aux_number3 = __x * __x + __y * __y;

    if (aux_number3 > EPS * EPS) {
        aux_number3 = 1 / aux_number3;
        out_vec2[0] = v1[0] * aux_number3;
        out_vec2[1] = v1[1] * aux_number3;
    }

    return out_vec2;
}
/**
 * Rotate the vector clockwise
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @return {Vec2}
 */
function perpendicular(out_vec2, v1) {
    aux_number1 = v1[0];
    out_vec2[0] = v1[1];
    out_vec2[1] = -aux_number1;

    return out_vec2;
}
/**
 * Rotate the vector counterclockwise
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @return {Vec2}
 */
function rperpendicular(out_vec2, v1) {
    aux_number1 = v1[0];
    out_vec2[0] = -v1[1];
    out_vec2[1] = aux_number1;

    return out_vec2;
}

/**
 * Linearly interpolate between a and b.
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @param {Number} t
 * @return {Vec2}
 */
function lerp(out_vec2, v1, v2, t) {
    out_vec2[0] = v1[0] + (v2[0] - v1[0]) * t;
    out_vec2[1] = v1[1] + (v2[1] - v1[1]) * t;

    return out_vec2;
}

/**
 * Linearly interpolate between v1 towards v2 by distance d.
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @param {Number} d
 * @return {Vec2}
 */
function lerpconst(out_vec2, v1, v2, d) {
    out_vec2[0] = v2[0] - v1[0];
    out_vec2[1] = v2[1] - v1[1];

    clamp(out_vec2, out_vec2, d);

    out_vec2[0] += v1[0];
    out_vec2[1] += v1[1];

    return out_vec2;
}

/**
 * Spherical linearly interpolate between v1 and v2.
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @param {Number} t
 * @return {Vec2}
 */
function slerp(out_vec2, v1, v2, t) {
    var omega = acos(dot(v1, v2)),
        denom;

    if (omega) {
        denom = 1.0 / sin(omega);

        scale(out_vec2, v1, sin((1.0 - t) * omega) * denom);
        scale(aux_vec, sin(t * omega) * denom);

        return add(out_vec2, out_vec2, aux_vec);
    }

    return copy(out_vec2, v1);
}

/**
 * Spherical linearly interpolate between v1 towards v2 by no more than angle a in radians.
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @param {Number} radians
 * @return {Vec2}
 */
function slerpconst(out_vec2, v1, v2, radians) {
    var _radians = acos(dot(v1, v2));
    return slerp(out_vec2, v1, v2, __min(radians, _radians) / _radians);
}

/**
 * Returns the unit length vector for the given angle (in radians).
 *
 * @param {Vec2} out_vec2
 * @param {Number} radians
 * @return {Vec2}
 */
function forAngle(out_vec2, radians) {
    out_vec2[0] = cos(radians);
    out_vec2[1] = sin(radians);

    return out_vec2;
}

/**
 * Returns the vector projection of v1 onto v2.
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
function project(out_vec2, v1, v2) {
    multiply(out_vec2, v1, v2);
    scale(out_vec2, dot(v1, v2) / dot(v2, v2));

    return out_vec2;
}

/**
 * Rotates the point by the given angle
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} radians
 * @return {Vec2}
 */
function rotate(out_vec2, v1, radians) {
    var s = sin(radians),
        c = cos(radians);

    __x = v1[0];
    __y = v1[1];

    out_vec2[0] = __x * c - __y * s;
    out_vec2[1] = __y * c + __x * s;

    return out_vec2;
}
/**
 * Rotates the point by the given angle around an optional center point.
 *
 * @note center cannot be out_vec2
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} radians
 * @param {Vec2} center
 * @return {Vec2}
 */
function rotateFrom(out_vec2, v1, radians, center) {
    subtract(out_vec2, v1, center);

    __x = out_vec2[0];
    __y = out_vec2[1];

    var s = sin(radians),
        c = cos(radians);


    out_vec2[0] = __x * c - __y * s;
    out_vec2[1] = __y * c + __x * s;

    add(out_vec2, out_vec2, center);

    return out_vec2;
}
/**
 * Rotate a vector given "angle" by a normalized vector v2_n
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2_n
 * @return {Vec2}
 */
function rotateVec(out_vec2, v1, v2_n) {
    out_vec2[0] = v1[0] * v2_n[0] - v1[1] * v2_n[1];
    out_vec2[1] = v1[0] * v2_n[1] + v1[1] * v2_n[0];

    return out_vec2;
}
/**
 * Un-rotate a vector given "angle" by a normalized vector v2_n
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2_n
 * @return {Vec2}
 */
function unrotateVec(out_vec2, v1, v2_n) {
    out_vec2[0] = v1[0] * v2_n[0] + v1[1] * v2_n[1];
    out_vec2[1] = v1[1] * v2_n[0] - v1[0] * v2_n[1];

    return out_vec2;
}
/**
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
function midPoint(out_vec2, v1, v2) {
    out_vec2[0] = (v1[0] + v2[0]) * 0.5;
    out_vec2[1] = (v1[1] + v2[1]) * 0.5;

    return out_vec2;
}

var reflect_factor;
/**
 * Reflect v1 by the imaginary line v2_n
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2_n
 * @return {Vec2}
 */
function reflect(out_vec2, v1, v2_n) {
    reflect_factor = dot(v1, v2_n);

    scale(out_vec2, v2_n, 2 * reflect_factor);
    subtract(out_vec2, v1, out_vec2);

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
function subtract(out_vec2, v1, v2) {
    out_vec2[0] = v1[0] - v2[0];
    out_vec2[1] = v1[1] - v2[1];

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} x
 * @param {Number} y
 * @return {Vec2}
 */
function subtract2(out_vec2, v1, x, y) {
    out_vec2[0] = v1[0] - x;
    out_vec2[1] = v1[1] - y;

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
function add(out_vec2, v1, v2) {
    out_vec2[0] = v1[0] + v2[0];
    out_vec2[1] = v1[1] + v2[1];

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} x
 * @param {Number} y
 * @return {Vec2}
 */
function add2(out_vec2, v1, x, y) {
    out_vec2[0] = v1[0] + x;
    out_vec2[1] = v1[1] + y;

    return out_vec2;
}
/**
 * @see scale
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
function multiply(out_vec2, v1, v2) {
    out_vec2[0] = v1[0] * v2[0];
    out_vec2[1] = v1[1] * v2[1];

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} x
 * @param {Number} y
 * @return {Vec2}
 */
function multiply2(out_vec2, v1, x, y) {
    out_vec2[0] = v1[0] * x;
    out_vec2[1] = v1[1] * y;

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
function divide(out_vec2, v1, v2) {
    out_vec2[0] = v1[0] / v2[0];
    out_vec2[1] = v1[1] / v2[1];

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} x
 * @param {Number} y
 * @return {Vec2}
 */
function divide2(out_vec2, v1, x, y) {
    out_vec2[0] = v1[0] / x;
    out_vec2[1] = v1[1] / y;

    return out_vec2;
}
/**
 * @see multiply
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} factor
 * @return {Vec2}
 */
function scale(out_vec2, v1, factor) {
    out_vec2[0] = v1[0] * factor;
    out_vec2[1] = v1[1] * factor;

    return out_vec2;
}
/**
 * (x1^y, y1^y)
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} y
 * @return {Vec2}
 */
function pow(out_vec2, v1, y) {
    if (y === 2) {
        out_vec2[0] = v1[0] * v1[0];
        out_vec2[1] = v1[1] * v1[1];
    } else {
        out_vec2[0] = __pow(v1[0], y);
        out_vec2[1] = __pow(v1[1], y);
    }

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
function max(out_vec2, v1, v2) {
    out_vec2[0] = v1[0] > v2[0] ? v1[0] : v2[0];
    out_vec2[1] = v1[1] > v2[1] ? v1[1] : v2[1];

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
function min(out_vec2, v1, v2) {
    out_vec2[0] = v1[0] < v2[0] ? v1[0] : v2[0];
    out_vec2[1] = v1[1] < v2[1] ? v1[1] : v2[1];

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @return {Vec2}
 */
function abs(out_vec2, v1) {
    out_vec2[0] = __abs(v1[0]);
    out_vec2[1] = __abs(v1[1]);

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @param {Number} factor
 * @return {Vec2}
 */
function scaleAndAdd(out_vec2, v1, v2, factor) {
    out_vec2[0] = v1[0] + (v2[0] * factor);
    out_vec2[1] = v1[1] + (v2[1] * factor);

    return out_vec2;
}
/**
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} length
 * @return {Vec2}
 */
function clamp(out_vec2, v1, length) {
    out_vec2[0] = v1[0];
    out_vec2[1] = v1[1];

    if (dot(v1, v1) > length * length) {
        normalize(out_vec2);
        multiply(out_vec2, length);
    }

    return out_vec2;
}
/**
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Number} length
 */
function truncate(out_vec2, v1, length) {
    var length_sq = v1[0] * v1[0] + v1[1] * v1[1];
    if (length_sq > length * length) {
        return scale(out_vec2, v1, length / sqrt(length_sq));
    }

    out_vec2[0] = v1[0];
    out_vec2[1] = v1[1];

    return out_vec2;
}

/**
 * Cross product between a vector and the Z component of a vector
 * AKA Rotate CW and scale
 *
 * @todo test use rprependicular ?
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} vec2
 * @param {Number} factor
 * @return {Number}
 */
function crossVZ(out_vec2, vec2, factor) {
    rotate(out_vec2, vec2, HALF_NPI); // Rotate according to the right hand rule
    return scale(out_vec2, out_vec2, factor); // Scale with z
}
/**
 * Cross product between a vector and the Z component of a vector
 * AKA Rotate CCW and scale
 *
 * @todo test use prependicular ?
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} vec2
 * @param {Number} factor
 * @return {Vec2}
 */
function crossZV(out_vec2, factor, vec2) {
    rotate(out_vec2, vec2, HALF_PI);
    return scale(out_vec2, out_vec2, factor);
}

var tp_left = [0, 0],
    tp_right = [0, 0];
/**
 * (A x B) x C = B(C · A) - A(C · B)
 * (A x B) x C = B(A.dot(C)) - A(B.dot(C))
 *
 * @param {Vec2} out_vec2
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @param {Vec2} v3
*/
function tripleProduct(out_vec2, v1, v2, v3) {
    scale(tp_left, v2, dot(v1, v3));

    scale(tp_right, v1, dot(v2, v3));

    return subtract(out_vec2, tp_left, tp_right);
}

// **********************************************************
// functions that return numbers
// **********************************************************

/**
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 */
function magnitude(v1, v2) {
    __x = v1[0] - v2[0];
    __y = v1[1] - v2[1];

    return __x / __y;
}

/**
 * v1 · v2 = |a| * |b| * sin θ
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 */
function dot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1];
}

/**
 * v1 × v2 = |a| * |b| * sin θ
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 */
function cross(v1, v2) {
    return v1[0] * v2[1] - v1[1] * v2[0];
}
/**
 * @param {Vec2} v1
 * @return {Number}
 */
function toAngle(v1) {
    return atan2(v1[1], v1[0]);
}

/**
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 */
function angleTo(v1, v2) {
    return atan2(v2[1] - v1[1], v2[0] - v1[0]);
}

var distance_x,
    distance_y;
/**
 * Returns the distance between v1 and v2.
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 */
function distance(v1, v2) {
    //subtract
    distance_x = v2[0] - v1[0];
    distance_y = v2[1] - v1[1];
    //sqrLength
    return sqrt(distance_x * distance_x + distance_y * distance_y);
}
/**
 * Distance without using sqrt (squared distance)
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 */
function sqrDistance(v1, v2) {
    //subtract
    distance_x = v1[0] - v2[0];
    distance_y = v1[1] - v2[1];
    //sqrLength
    return distance_x * distance_x + distance_y * distance_y;
}

/**
 * Return vector the length.
 *
 * @param {Vec2} v1
 * @return {Number}
 */
function length(v1) {
    return sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
}
/**
 * Squared length (no sqrt)
 *
 * @param {Vec2} v1
 * @return {Number}
 */
function sqrLength(v1) {
    return v1[0] * v1[0] + v1[1] * v1[1];
}

/**
 * Return true if v2 is between v1 and v3(inclusive)
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @param {Vec2} v3
 * @return {Boolean}
 */
function within(v1, v2, v3) {
    return ((v1[0] <= v2[0] && v2[0] <= v3[0]) || (v3[0] <= v2[0] && v2[0] <= v1[0])) &&
          ((v1[1] <= v2[1] && v2[1] <= v3[1]) || (v3[1] <= v2[1] && v2[1] <= v1[1]));
}

/**
 * Return true if q is between p and r(inclusive)
 *
 * @param {Number} px
 * @param {Number} py
 * @param {Number} qx
 * @param {Number} qy
 * @param {Number} rx
 * @param {Number} ry
 * @return {Boolean}
 */
function $within(px, py, qx, qy, rx, ry) {
    return ((px <= qx && qx <= rx) || (rx <= qx && qx <= px)) &&
          ((py <= qy && qy <= ry) || (ry <= qy && qy <= py));
}

/**
 * p is near x ± dist ("box test")
 *
 * @param {Number} px
 * @param {Number} py
 * @param {Number} qx
 * @param {Number} qy
 * @param {Number} dist EPS
 * @return {Boolean}
 */
function $near(px, py, qx, qy, dist) {
    return (px > qx ? (px - qx) < dist : (qx - px) < dist) &&
           (py > qy ? (py - qy) < dist : (qy - py) < dist);
}
/**
 *
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @return {Number}
 */
function $cross(x1, y1, x2, y2) {
    return x1 * y2 - y1 * x2;
}

/**
 *
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @return {Number}
 */
function $dot(x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
}
/**
 * Swap vectors, both will be modified.
 * for lazy people
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Undefined}
 */
function swap(v1, v2) {
    __x = v2[0];
    v2[0] = v1[0];
    v1[0] = __x;

    __x = v2[1];
    v2[1] = v1[1];
    v1[1] = __x;
}
/*
 * (x, y) with only two decimals, for readability
 * @param {Vec2} v1
 * @return {String}
 */
function toString(v1) {
    return "(" + v1[0].toFixed(2) + "," + v1[1].toFixed(2) + ")";
}

Vec2 = {
    ZERO: [0, 0],
    create: create,
    dFromPolar: dFromPolar,
    fromPolar: fromPolar,
    zero: zero,
    clone: clone,
    equals: equals,
    equalsEpsilon: equalsEpsilon,
    gt: gt,
    lt: lt,
    near: near,
    isValid: isValid,
    isNaN: isNaN,
    copy: copy,
    negate: negate,
    perpendicular: perpendicular,
    perp: perpendicular,
    rotateCW: perpendicular,
    normalize: normalize,
    normalizeSq: normalizeSq,
    rperpendicular: rperpendicular,
    rperp: rperpendicular,
    rotateCCW: rperpendicular,
    lerp: lerp,
    interpolate: lerp,
    lerpconst: lerpconst,
    slerp: slerp,
    slerpconst: slerpconst,
    forAngle: forAngle,
    project: project,
    rotate: rotate,
    rotateFrom: rotateFrom,
    rotateVec: rotateVec,
    unrotateVec: unrotateVec,
    midPoint: midPoint,
    reflect: reflect,
    subtract: subtract,
    subtract2: subtract2,
    add: add,
    add2: add2,
    multiply: multiply,
    multiply2: multiply2,
    divide: divide,
    divide2: divide2,
    scale: scale,
    pow: pow,
    max: max,
    min: min,
    abs: abs,
    scaleAndAdd: scaleAndAdd,
    clamp: clamp,
    truncate: truncate,
    magnitude: magnitude,
    compare: compare,
    dot: dot,
    cross: cross,
    crossVZ: crossVZ,
    crossZV: crossZV,
    toAngle: toAngle,
    angle: toAngle,
    angleTo: angleTo,
    distance: distance,
    length: length,
    sqrDistance: sqrDistance,
    sqrLength: sqrLength,
    within: within,
    swap: swap,
    tripleProduct: tripleProduct,

    // alias
    eq: equals,
    sub: subtract,
    sub2: subtract2,
    mul: multiply,
    mul2: multiply2,
    div: divide,
    div2: divide2,
    distanceSq: sqrDistance,
    lengthSq: sqrLength,
    $within: $within,
    $near: $near,
    $cross: $cross,
    $dot: $dot,

    toString: toString
};

module.exports = Vec2;

},{}],31:[function(require,module,exports){
// from: http://jsdo.it/akm2/fhMC/js
// don't know the author :)
// I just lint the code... and adapt it to this lib philosophy

// Helper

function _mash(data) {
    data = data.toString();
    var n = 0xefc8249d,
        i,
        len,
        h;

    for (i = 0, len = data.length; i < len; i++) {
        n += data.charCodeAt(i);
        h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000;
    }
    return (n >>> 0) * 2.3283064365386963e-10;
}

/**
 * Random numbers generator
 * Returns an object with three methods
 * * uint32()
 * * random()
 * * fract53()
 *
 * @see http://baagoe.com/en/RandomMusings/javascript/
 * @see http://en.wikipedia.org/wiki/Xorshift
 * @source http://jsdo.it/akm2/fhMC/js
 *
 * @param {Array} seeds
 * @return {Object} {uint32: Function, random: Function, fract53: Function}
 */
function create(seeds) {
    var self = this,
        seeds = (arguments.length) ? Array.prototype.slice.call(arguments) : [new Date().getTime()],

        x = 123456789,
        y = 362436069,
        z = 521288629,
        w = 88675123,
        v = 886756453,
        i,
        len,
        seed,
        t;

    for (i = 0, len = seeds.length; i < len; i++) {
        seed = seeds[i];
        x ^= _mash(seed) * 0x100000000;
        y ^= _mash(seed) * 0x100000000;
        z ^= _mash(seed) * 0x100000000;
        v ^= _mash(seed) * 0x100000000;
        w ^= _mash(seed) * 0x100000000;
    }

    return {
        uint32: function () {
            t = (x ^ (x >>> 7)) >>> 0;
            x = y;
            y = z;
            z = w;
            w = v;
            v = (v ^ (v << 6)) ^ (t ^ (t << 13)) >>> 0;
            return ((y + y + 1) * v) >>> 0;
        },

        random: function () {
            return self.uint32() * 2.3283064365386963e-10;
        },

        fract53: function () {
            return self.random() + (self.uint32() & 0x1fffff) * 1.1102230246251565e-16;
        }
    };
};

Xorshift = {
    create: create
};

module.exports = Xorshift;
},{}],32:[function(require,module,exports){
(function () {
    "use strict";

    module.exports = require("./lib/arrays.js");

}());
},{"./lib/arrays.js":33}],33:[function(require,module,exports){
(function () {
    "use strict";

/**
* TODO
* - some mozilla functions use .call but thisp could be "undefined" so -> can be replaced by direct call ?!
*
*/

    var slice = Array.prototype.slice,
        hasOwnProperty = Object.hasOwnProperty,
        __clone,
        __rfilter;

    /**
     * Create an array given any type of argument
     *
     * @param {Mixed} item
     * @returns {Array}
     */
    module.exports.ize = function (item) {
        if (item === null || item === undefined) {
            return [];
        }

        if (item instanceof Array) {
            return item;
        }

        if (hasOwnProperty.call(item, "callee")) {
            return slice.call(item);
        }

        // TODO deal with Iterable objects like Collections!

        return [ item ];
    };

    module.exports.from = Array.ize;

    /**
     * Append any given number of arrays into a new one
     * @todo support any type of arguments
     *
     * @returns Array
    */
    module.exports.add = function () {
        var i,
            j,
            ret = [],
            ar;

        for (i = 0; i < arguments.length; ++i) {
            ar = arguments[i];
            for (j = 0; j < ar.length; ++j) {
                ret.push(ar[j]);
            }
        }

        return ret;
    };
    /**
     * Clone (could be recursive) a dense array
     * Note: only loop arrays not objects
     *
     * @param Array ar
     * @param Boolean deep
     * @returns Array
    */
    module.exports.clone = __clone = function (ar, deep) {
        var i = ar.length,
            clone = new Array(i);
        while (i--) {
            if (deep && ar[i] instanceof Array) {
                clone[i] = __clone(ar[i], true);
            } else {
                clone[i] = ar[i];
            }
        }
        return clone;
    };
    /**
     * Add an element at the specified index
     *
     * @param {Array} ar
     * @param {Mixed} o The object to add
     * @param {int} index The index position the element has to be inserted
     * @return {Boolean} true if o is successfully inserted
     */
    module.exports.insertAt = function (ar, o, index) {
        if (index > -1 && index <= ar.length) {
            ar.splice(index, 0, o);
            return true;
        }
        return false;
    };
    /**
     * Get a random value, the array must be dense
     *
     * @param {Array} arr
     * @returns {Mixed}
     */
    module.exports.random = function (arr) {
        var l = Math.floor(Math.random() * arr.length);
        return arr[l];
    };
    /**
     * Create a new array removing duplicated values
     *
     * @param {Array} arr
     * @returns {Array}
     */
    module.exports.unique = function (arr) {
        var ret = [],
            i;

        for (i = 0; i < arr.length; ++i) {
            if (ret.indexOf(arr[i]) === -1) {
                ret.push(arr[i]);
            }
        }

        return ret;
    };

    /**
     * sort an array (must be dense)
     *
     * @param {Array} arr
     * @returns {Array}
     */
    module.exports.sortObject = function (arr, key) {
        arr.sort(function (a, b) {
            if ("string" === (typeof a[key])) {
                return a.value.toLowerCase().localeCompare(b.value.toLowerCase());
            }
            return a[key] - b[key];
        });

        return arr;
    };
    /**
     * This function shuffles (randomizes the order of the elements in) an array.
     * credits -  http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
     * @note Given array is modified!
     * @param {Array} arr
     * @returns {Array}
     */
    module.exports.shuffle = function (arr) {
        var currentIndex = arr.length,
            temporaryValue,
            randomIndex;

        // While there remain elements to shuffle..
        while (0 !== currentIndex) {

            // Pick a remaining element..
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = arr[currentIndex];
            arr[currentIndex] = arr[randomIndex];
            arr[randomIndex] = temporaryValue;
        }

        return arr;
    };

    /**
     * Iterates over each value in the array passing them to the callback function.
     * Returns an array with all the callback results
     * @param {Array} arr
     * @param {Function} fun
     * @returns {Array}
     */
    module.exports.rfilter = __rfilter = function (arr, fun /*, thisp */) {
        if (arr === null) {
            throw new TypeError();
        }

        var t = Object(arr),
            len = t.length >>> 0,
            res,
            thisp,
            i,
            val,
            r;

        if ("function" !== typeof fun) {
            throw new TypeError();
        }

        res = [];
        thisp = arguments[1];
        for (i = 0; i < len; i++) {
            if (i in t) {
                val = t[i]; // in case fun mutates this
                r = fun.call(thisp, val, i, t);
                if (r !== undefined) {
                    res.push(r);
                }
            }
        }

        return res;
    };

    module.exports.chunk = function (arr, size, preserve_keys) {
        preserve_keys = preserve_keys || false;

        var i = 0,
            j = 0,
            key,
            val,
            chunks = [[]];

        //while( @list( $key, $value ) = @each( arr ) ) {
        for (key = 0; key < arr.length; ++key) {
            val = arr[key];


            if (chunks[i].length < size) {
                if (preserve_keys) {
                    chunks[i][key] = val;
                    j++;
                } else {
                    chunks[i].push(val);
                }
            } else {
                i++;
                chunks.push([]);

                if (preserve_keys) {
                    chunks[i][key] = val;
                    j++;
                } else {
                    j = 0;
                    chunks[i][j] = val;
                }
            }
        }

        return chunks;
    };
    /**
     * returns the values from a single column of the array-of-objects/arrays, identified by the column_key.
     * Optionally, you may provide an index_key to index the values in the returned array by the values from the index_key column in the input array.
     */
    module.exports.column = function (arr, field) {
        return Array.rfilter(arr, function (x) { return x ? x[field] : undefined; });
    };
    /**
     * Append any number of arrays into the first one
     *
     * @param {Array} dst
     * @returns {Array}
     */
    module.exports.combine = function (dst) {
        var i,
            j,
            ar;

        for (j = 1; j < arguments.length; ++j) {
            ar = arguments[j];

            for (i = 0; i < ar.length; ++i) {
                dst.push(ar[i]);
            }
        }
    };
    /**
     * Counts all the values of an array
     */
    module.exports.countValues = function (arr, ci) {
        ci = ci || false;
        var i,
            counter = {},
            val;

        for (i = 0; i < arr.length; ++i) {
            val = arr[i];
            if (ci && "string" === typeof val) {
                val = val.toLowerCase();
            }

            if (counter[val]) {
                ++counter[val];
            } else {
                counter[val] = 1;
            }
        }

        return counter;
    };
    /**
     * Returns a copy of the array padded to size specified by size with value value. If size is positive then the array is padded on the right, if it"s negative then on the left. If the absolute value of size is less than or equal to the length of the array then no padding takes place
     */
    module.exports.pad = function (arr, size, value) {
        if (Math.abs(size) <= arr.length) {
            return arr;
        }
        var out = [],
            i,
            len;

        if (size > 0) {
            for (i = 0;  i < size; ++i) {
                out[i] = i < arr.length ? arr[i] : value;
            }
        } else {
            size = Math.abs(size);
            len = size - arr.length;
            for (i = 0;  i < size; ++i) {
                out[i] = i < len ? value : arr[i - len];
            }
        }

        return out;
    };
    /**
     * Calculate the product of values in an array
     */
    module.exports.product = function (arr) {
        var sum = 1,
            len = arr.length,
            i;

        for (i = 0; i < len; i++) {
            sum *= parseFloat(arr[i]); // be sure it"s a number..
        }

        return sum;
    };
    /**
     * Picks one or more random entries out of an array, and returns the key (or keys) of the random entries.
     */
    module.exports.rand = function (arr, len) {
        var out = [],
            i;
        len = len || 1;

        for (i = 0; i < len; ++i) {
            out.push(Math.floor(Math.random() * arr.length));
        }

        return out;
    };

    module.exports.dense = function (arr) {
        var out = [];

        arr.forEach(function (val) {
            out.push(val);
        });

        return out;
    };

    module.exports.sum = function (arr) {
        var sum = 0,
            len = arr.length,
            i;

        for (i = 0; i < len; i++) {
            sum += parseFloat(arr[i]); // be sure it"s a number..
        }

        return sum;
    };

    /**
     * Fill an array with values
     */
    module.exports.fill = function (start, count, value) {
        var arr = [],
            len = start + count,
            i;

        for (i = start; i < len; ++i) {
            arr[i] = value;
        }

        return arr;
    };
    /**
     * Return the values from a single column in the input array
     */
    module.exports.column = function (arr, field) {
        return __rfilter(arr, function (x) { return x[field]; });
    };

    /**
     * returns an object with the same values keys given a property of the object
     * @throws if the field is undefined!
     */
    module.exports.kmap = function (arr, field) {
        var ret = {};

        arr.forEach(function (v) {
            if (!v[field]) {
                console.log(v);
                throw new Error("field not found in v");
            }

            ret[v[field]] = v;
        });

        return ret;
    };


    module.exports.oFilter = function (arr, obj) {
        if (!arr) return [];

        var res = [],
            i,
            f,
            j,
            max = arr.length;

        for (i = 0; i < max; ++i) {
            if (arr[i]) {
                f = true;
                for (j in obj) {
                    if (arr[i][j] !== obj[j]) {
                        f = false;
                    }
                }
                if (f) {
                    res.push(arr[i]);
                }
            }
        }

        return res;
    };

    /**
     * Returns the key of the object contained in the array that has the same value in given key.
     * @throws if the field is undefined!
     */
    module.exports.search = function (arr, key, value) {
        if (!arr || !arr.length) {
            return -1;
        }

        var i,
            max = arr.length;

        for (i = 0; i < max; ++i) {
            if (arr[i] && arr[i][key] == value) {
                return i;
            }
        }

        return -1;
    };


    module.exports.mapAsync = function (arr, callback, donecallback, thisArg) {
        if (!arr || !arr.length) {
            return donecallback();
        }

        var i,
            max = arr.length,
            done_count = 0,
            ret = [],
            done = function(value, key) {
                if (ret.length === 0 && key) {
                    ret = {};
                }

                // no first
                key = key || done_count;
                ret[key] = value;


                if (++done_count === max) {
                    donecallback(ret);
                }
            };

        for (i = 0; i < max; ++i) {
            if (thisArg) {
                callback.call(thisArg, arr[i], i, done);
            } else {
                callback(arr[i], i, done);
            }

        }
    };

    module.exports.mapSerial = function (arr, callback, donecallback, thisArg) {
        if (!arr || !arr.length) {
            return donecallback();
        }

        var i = 0,
            max = arr.length,
            ret = [],
            next = function(value, key) {
                // change ret to object if first call has key
                if (i === 1 && key) {
                    ret = {};
                }


                // no first
                if (i !== 0) {
                    key = key || i;
                    ret[key] = value;
                }

                var ci = i,
                    ct = arr[i];

                if (++i > max) {
                    return donecallback(ret);
                }

                if (thisArg) {
                    callback.call(thisArg, ct, ci, next, end);
                } else {
                    callback(ct, ci, next, end);
                }

            },
            end = function(value, key) {
                key = key || i;
                ret[key] = value;

                donecallback(ret);
            };

        next();
    };
}());
},{}],34:[function(require,module,exports){
(function () {
    "use strict";

    module.exports = require("./lib/objects.js");

}());
},{"./lib/objects.js":35}],35:[function(require,module,exports){
(function () {
    "use strict";

    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable("toString"),
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length,
        ArrayPush = Array.prototype.push,
        ObjectConstructor = Object.prototype.constructor,
        __typeof,
        __merge,
        __depth,
        __rfilter,
        __debug = true;

    module.exports["typeof"] = __typeof = function (val) {
        if (val === null || val === undefined) {
            return "null";
        }
        // dont deal with undefine...
        if (val === true || val === false) {
            return "boolean";
        }

        var type = typeof val;

        if (type === "object") {
            // for performance, we check if it"s a plain object first
            if (type.constructor === ObjectConstructor) {
                return type;
            }

            if (val.push === ArrayPush && val.length != null) { // != null is ok!
                return "array";
            }
            // for performance, I will keep this insecure
            // if (hasOwnProperty.call(val, "callee")) {
            if (val.hasOwnProperty && val.hasOwnProperty("callee")) {
                return "arguments";
            }
            if (val instanceof Date) {
                return "date";
            }
            if (val instanceof RegExp) {
                return "regexp";
            }

            // this is an instance of something?
        } else if (type === "number" && isNaN(val)) {
            return "null";
        }

        return type;
    };

    //
    // Object
    //

    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
        Object.keys = function (obj) {
            if (typeof obj !== "object" && (typeof obj !== "function" || obj === null)) {
                throw new TypeError("Object.keys called on non-object");
            }

            var result = [], prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }

    // define Object.defineProperty if not found, no functionality just a replacement so your code not throw!
    if (!Object.defineProperty) {
        Object.defineProperty = function (obj, name, prop) {
            if (prop.get || prop.set) {
                throw new Error("this is not supported in your js.engine");
            }
            obj[name] = prop.value;
        };
    }


    // define Object.seal if not found, no functionality just a replacement so your code not throw!
    if (!Object.seal) {
        Object.seal = function (obj) {
            return obj;
        };
    }

    module.exports.values = function (obj) {
        if (__debug) {
            if (typeof obj !== "object" && (typeof obj !== "function" || obj === null)) {
                throw new TypeError("Object.values called on non-object");
            }
        }

        var result = [],
            prop;

        for (prop in obj) {
            if (!__debug || hasOwnProperty.call(obj, prop)) {
                result.push(obj[prop]);
            }
        }

        return result;
    };


    /**
     * get the keys of an object (or anything iterable for...in) note: remove prototype key
     *
     * @param {Object} object
     * @param {Function} fn
     * @returns {Object} object
     */
    function __each(object, fn) {
        var key = null;

        for (key in object) {
            fn(object[key], key);
        }

        return object;
    }

    module.exports.each = __each;

    module.exports.forEach = __each;

    module.exports.clone = function (obj) {
        return __merge({}, obj, true, false);
    };

    /**
     * merge two object
     *
     *
     * @params {Object} to, this parameter is modified
     * @params {Object} from
     * @params {Boolean} clone
     * @params {Boolean} must_exists do not allow undefined in the objects
     */
    module.exports.merge = __merge = function (to, from, clone, must_exists) {
        //console.log("Object.merge", from);
        clone = clone || false;
        must_exists = must_exists || false;

        var ftype = __typeof(from),
            key,
            ret;

        switch (ftype) {
        case "string":
            return clone ? "" + from : from;
        case "number":
            return clone ? 0 + from : from;
        case "array": // maybe need more deep clone ?

            if (clone) {
                ret = [];
                for (key = 0; key < from.length; ++key) {
                    ret[key] = __merge(to[key] || {}, from[key], clone, must_exists);
                }

                return ret;
            }

            return from;
        case "boolean":
            return clone ? (from ? true : false) : from;
        case "null":
            return null;
        case "function":
            return from;
        case "object":
            // to it not an object, overwrite!
            ret = __typeof(to) !== "object" ? {} : to || {};
            // if has prototype just copy
            key = null;

            for (key in from) {
                if (key !== "prototype") {
                    if (ret[key] === undefined) {
                        if (must_exists) {
                            continue;
                        }
                        ret[key] = {};
                    }
                    ret[key] = __merge(ret[key] || {}, from[key], clone, must_exists);
                }
            }

            return ret;
        case "regexp":
            return new RegExp(from.source);
        case "date":
            return clone ? new Date(from) : from;
        }
        // unknown type... just return
        return from;
    };

    module.exports.combine = function (keys, values) {
        values = values || [];
        var i,
            ret = {};

        for (i = 0; i < keys.length; ++i) {
            ret[keys[i]] = values[i] === undefined ? null : values[i];
        }
        return ret;
    };

    module.exports.ksort = function (from) {
        var keys = Object.keys(from),
            i,
            ret = {};

        for (i = 0; i < keys.length; ++i) {
            ret[keys[i]] = from[keys[i]];
        }

        return ret;
    };

    module.exports.extend = function () {
        var target = arguments[0] || {},
            o,
            p,
            i,
            len;

        for (i = 1, len = arguments.length; i < len; i++) {
            o = arguments[i];

            if ("object" === typeof o && o !== null) {
                for (p in o) {
                    target[p] = o[p];
                }
            }
        }

        return target;
    };

    module.exports.extract = function (from, keys, default_value) {
        var i,
            ret = {};

        default_value = default_value === undefined ? null : default_value;

        for (i = 0; i < keys.length; ++i) {
            ret[keys[i]] = from[keys[i]] === undefined ? default_value : from[keys[i]];
        }

        return ret;
    };

    module.exports.empty = function (obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    };

    module.exports.depth = __depth = function (obj) {
        var i,
            max,
            props = false,
            d = 0;

        if (obj === null || obj === undefined) {
            return 0;
        }

        if (Array.isArray(obj)) {
            // array

            for (i = 0, max = obj.length; i < max; ++i) {
                d = Math.max(d, __depth(obj[i]));
            }
            props = max > 0;
        } else if ("object" === typeof obj) {
            // object

            for (i in obj) {
                props = true;
                d = Math.max(d, __depth(obj[i]));
            }
        }

        return (props ? 1 : 0) + d;
    };

    module.exports.rFilter = __rfilter = function (obj, callback, loop_arrays) {
        var i,
            max;
        loop_arrays = loop_arrays === true;

        if (Array.isArray(obj)) {
            // array
            if (!loop_arrays) {
                obj = callback(obj);
            } else {
                for (i = 0, max = obj.length; i < max; ++i) {
                    obj[i] = __rfilter(obj[i], callback, loop_arrays);
                }
            }

            return obj;
        }

        if ("object" === typeof obj) {
            // object
            if (!(obj instanceof Date || obj instanceof RegExp)) {

                for (i in obj) {
                    obj[i] = __rfilter(obj[i], callback, loop_arrays);
                }
                return obj;
            }
        }

        return callback(obj);
    };

    module.exports.prefixKeys = function (obj, prefix, ignore_keys) {
        ignore_keys = ignore_keys || [];
        var i,
            ret = {};

        if (ignore_keys.length) {
            for (i in obj) {
                if (ignore_keys.indexOf(i) === -1) {
                    ret[prefix + i] = obj[i];
                } else {
                    ret[i] = obj[i];
                }
            }
        } else {
            for (i in obj) {
                ret[prefix + i] = obj[i];
            }
        }

        return ret;
    };

    module.exports.remPrefixKeys = function (obj, prefix, ignore_keys) {
        ignore_keys = ignore_keys || [];
        var i,
            prefix_len = prefix.length,
            ret = {};

        if (ignore_keys.length) {
            for (i in obj) {
                if (ignore_keys.indexOf(i) === -1) {
                    if (i.indexOf(prefix) === 0) {
                        ret[i.substring(prefix_len)] = obj[i];
                    } else {
                        ret[i] = obj[i];
                    }
                } else {
                    ret[i] = obj[i];
                }
            }
        } else {
            for (i in obj) {
                if (i.indexOf(prefix) === 0) {
                    ret[i.substring(prefix_len)] = obj[i];
                } else {
                    ret[i] = obj[i];
                }
            }
        }

        return ret;
    };


    module.exports.diff = function (obj) {
        var ret = {},
            argl = arguments.length,
            k1,
            i,
            found;

        for (k1 in obj) {
            found = false;
            for (i = 1; i < argl && !found; ++i) {
                if (obj[k1] === arguments[i][k1]) {
                    found  = true;
                }
            }

            if (!found) {
                ret[k1] = obj[k1];
            }

        }

        return ret;

    };

}());
},{}]},{},[])