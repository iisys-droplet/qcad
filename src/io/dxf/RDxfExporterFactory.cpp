/**
 * Copyright (c) 2011-2013 by Andrew Mustun. All rights reserved.
 *
 * This file is part of the QCAD project.
 *
 * QCAD is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * QCAD is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with QCAD.
 */

#include "RDxfExporterFactory.h"

QStringList RDxfExporterFactory::getFilterStrings() {
    QStringList ret;
    ret << "DXF R12 (dxflib) (*.dxf)";
    ret << "DXF 2000 (dxflib) (*.dxf)";
    return ret;
}

bool RDxfExporterFactory::canExport(const QString& fileName, const QString& nameFilter) {
    QFileInfo fi(fileName);

    // supported file suffix:
    if (fi.suffix().toLower() == "dxf") {
        return true;
    }

    // supported name filter if no extension is given:
    QString nfl = nameFilter.toLower();
    if (nfl.contains(".dxf")) {
        return true;
    }

    return false;
}
