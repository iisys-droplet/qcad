/**
 * Simple Modification API, mainly designed for use in the ECMAScript console.
 */

/**
 * Moves the given entity or shape by the given offset.
 * \ingroup ecma_simple
 *
 * \param e Entity, entity ID or shape.
 *
 * \code
 * move(entity, x,y)
 * move(entity, [x,y])
 * move(entity, new RVector(x,y))
 * \endcode
 */
function move(e, offset) {
    if (arguments.length===3) {
        return move(arguments[0], new RVector(arguments[1], arguments[2]));
    }

    if (isArray(offset)) {
        return move(e, new RVector(offset));
    }
    if (isNumber(e)) {
        var doc = getDocument();
        if (isNull(doc)) {
            return undefined;
        }
        var entity = doc.queryEntity(e);
        return move(entity, offset);
    }

    e.move(offset);
    return addEntity(e);
}

/**
 * Rotates the given entity or shape by the given angle around the given center.
 * \ingroup ecma_simple
 *
 * \param e Entity, entity ID or shape.
 *
 * \code
 * rotate(entity, angle, cx,cy)
 * rotate(entity, angle, [cx,cy])
 * rotate(entity, angle, new RVector(cx,cy))
 * \endcode
 */
function rotate(e, angle, center) {
    if (arguments.length===4) {
        return rotate(arguments[0], arguments[1], new RVector(arguments[2], arguments[3]));
    }

    if (isArray(center)) {
        return rotate(e, angle, new RVector(center));
    }
    if (isNumber(e)) {
        var doc = getDocument();
        if (isNull(doc)) {
            return undefined;
        }
        var entity = doc.queryEntity(e);
        return rotate(entity, angle, center);
    }

    if (isNull(p1)) {
        e.rotate(deg2rad(angle));
    }
    else {
        e.rotate(deg2rad(angle), center);
    }
    return addEntity(e);
}

/**
 * Scales the given entity or shape by the given factor with the given focus point.
 * \ingroup ecma_simple
 *
 * \param e Entity, entity ID or shape.
 *
 * \code
 * scale(entity, factor, cx,cy)
 * scale(entity, factor, [cx,cy])
 * scale(entity, factor, new RVector(cx,cy))
 * \endcode
 */
function scale(e, factor, focusPoint) {
    if (arguments.length===4) {
        return scale(arguments[0], arguments[1], new RVector(arguments[2], arguments[3]));
    }

    if (isNumber(focusPoint)) {
        return scale(e, factor, new RVector(focusPoint));
    }
    if (isNumber(e)) {
        var doc = getDocument();
        if (isNull(doc)) {
            return undefined;
        }
        var entity = doc.queryEntity(e);
        return scale(entity, factor, focusPoint);
    }

    if (isNull(p1)) {
        e.scale(factor);
    }
    else {
        e.scale(factor, p1);
    }
    return addEntity(e);
}

/**
 * Mirrors the given entity or shape at the given axis.
 * \ingroup ecma_simple
 *
 * \param e Entity, entity ID or shape.
 *
 * \code
 * mirror(entity, x1,y1, x2,y2)
 * mirror(entity, [x1,y1], [x2,y2])
 * mirror(entity, new RVector(x1,y1), new RVector(x2,y2))
 * mirror(entity, new RLine(x1,y1, x2, y2))
 * mirror(entity, [new RVector(x1,y1), new RVector(x2,y2)])
 * mirror(entity, [[x1,y1], [x2,y2]])
 * \endcode
 */
function mirror(e, axis) {
    if (arguments.length===5) {
        return mirror(arguments[0], new RLine(arguments[1], arguments[2], arguments[3], arguments[4]));
    }
    if (arguments.length===3) {
        var p1 = arguments[1];
        if (isArray(p1)) {
            p1 = new RVector(p1);
        }
        var p2 = arguments[1];
        if (isArray(p2)) {
            p2 = new RVector(p2);
        }
        return mirror(arguments[0], new RLine(p1, p2));
    }

    if (isArray(axis)) {
        if (isVector(axis[0])) {
            return mirror(e, new RLine(axis[0], axis[1]));
        }
        return mirror(e, new RLine(new RVector(axis[0]), new RVector(axis[1])));
    }
    if (isNumber(e)) {
        var doc = getDocument();
        if (isNull(doc)) {
            return undefined;
        }
        var entity = doc.queryEntity(e);
        return mirror(entity, axis);
    }

    e.mirror(axis);
    return addEntity(e);
}

/**
 * Trims the given entity / entities or shape(s).
 * \ingroup ecma_simple
 *
 * \param trimEntity Entity, entity ID or shape to trim
 * \param trimClickPos Position clicked when choosing trim entity.
 * \param limitingEntity Entity, entity ID or shape that limits the trimming.
 * \param limitingClickPos Position clicked when choosing limiting entity.
 * \param trimBoth True to trim both entities.
 *
 * \return RTransaction created by operation if no operation is given. If op is given, undefined is returned.
 *
 * \code
 * trim(trimEntity, x1,y1, limitingEntity, x2,y2, trimBoth)
 * trim(trimEntity, [x1,y1], limitingEntity, [x2,y2], trimBoth)
 * trim(trimEntity, new RVector(x1,y1), limitingEntity, new RVector(x2,y2), trimBoth)
 * \endcode
 */
function trim(trimEntity, trimClickPos, limitingEntity, limitingClickPos, trimBoth) {
    if (arguments.length===7) {
        return trim(arguments[0], new RVector(arguments[1], arguments[2]), arguments[3], new RVector(arguments[4], arguments[5]), arguments[6]);
    }

    var trimShape, limitingShape;

    var doc = getDocument();
    if (isNull(doc)) {
        return undefined;
    }

    if (isNumber(trimEntity)) {
        trimEntity = doc.queryEntity(trimEntity);
    }
    if (isNumber(limitingEntity)) {
        limitingEntity = doc.queryEntity(limitingEntity);
    }

    if (isShape(trimEntity) && isShape(limitingShape)) {
        trimShape = trimEntity;
        limitingShape = limitingEntity;
    }
    else {
        trimShape = trimEntity.castToShape();
        limitingShape = limitingEntity.castToShape();
        if (isNull(limitingShape)) {
            limitingShape = limitingEntity.getClosestSimpleShape(limitingClickPos);
            if (!isNull(limitingShape)) {
                limitingShape = limitingShape.data();
            }
        }
    }

    if (isNull(trimShape) || isNull(limitingShape)) {
        return undefined;
    }

    var samePolyline = (limitingEntity.getId()===trimEntity.getId() && isPolylineEntity(limitingEntity));
    if (samePolyline) {
        if (!trimBoth) {
            // TODO: fix trimming one segment within same polyline:
            return undefined;
        }
    }

    var newShapes = RShape.trim(trimShape, trimClickPos, limitingShape, limitingClickPos, trimBoth, samePolyline);
    if (newShapes.length===0) {
        return undefined;
    }

    var op = getOperation();

    if (!modifyEntity(op, trimEntity.clone(), newShapes[0].data())) {
        if (trimBoth) {
            warning(qsTr("First entity cannot be trimmed."));
        }
        else {
            warning(qsTr("Entity cannot be trimmed."));
        }
    }

    if (newShapes.length===1) {
        // trimming was within same polyline
    }
    else {
        if (trimBoth) {
            if (!modifyEntity(op, limitingEntity.clone(), newShapes[1].data())) {
                warning(qsTr("Second entity cannot be trimmed."));
            }
        }
    }

    if (!__simpleUseOp) {
        var di = getDocumentInterface();
        return di.applyOperation(op);
    }
}

/**
 * Lengthens of shortens the given entity or shape.
 * \ingroup ecma_simple
 *
 * \param entity Entity, entity ID or shape to lengthen
 * \param start True to extend at start point, false for end point
 * \param amount Amount to lengthen or negative value to shorten
 */
function lengthen(entity, start, amount) {
    var doc = getDocument();
    if (isNull(doc)) {
        return undefined;
    }

    if (isNumber(entity)) {
        entity = doc.queryEntity(entity);
    }

    var from = RS.FromStart;
    if (!start) {
        from = RS.FromEnd;
    }

    var pts = entity.getPointsWithDistanceToEnd(-amount, from);
    if (pts.length===1) {
        if (start) {
            entity.trimStartPoint(pts[0], pts[0], true);
        }
        else {
            entity.trimEndPoint(pts[0], pts[0], true);
        }
    }

    return addEntity(entity);
}
