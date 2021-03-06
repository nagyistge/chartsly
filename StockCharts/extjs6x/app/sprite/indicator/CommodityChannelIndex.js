/**
 * @class Chartsly.sprite.indicator.CommodityChannelIndex
 * @extends Ext.chart.series.sprite.Line
 *
 * Commodity Channel Index (CCI) series sprite. This does the following:
 * 1) Draws and fills the strong area
 * 2) Draws and fills the weak area
 * 3) Draws horizontal lines for strong level, weak level and 0
 * 4) Draws the line graph
 */
Ext.define('Chartsly.sprite.indicator.CommodityChannelIndex', {
    alias: 'sprite.cci',
    extend: 'Ext.chart.series.sprite.Line',

    inheritableStatics: {
        def: {
            processors: {
                preciseStroke: 'bool',
                strongLevel: 'number',
                weakLevel: 'number',
                period: 'number'
            }
        }
    },

    list: null,

    /**
     * @private
     * Draws strong area and fills it with the specified style
     * @param ctx SVG or Canvas context
     * @param list list containing the transformed co-ordinates
     * @param osLevel oversold level(e.g. -20) transfromed to the ctx co-ordinates
     * @return
     *
     * TODO: This method's internal implementation is same as William %R. Re-factor it later
     */
    drawStrong: function (ctx, list, obLevel) {
        var attr = this.attr,
            i, x, y, x0, y0, obx = 0, oby = obLevel, obStart = false, obEnd = false;

        var lbPeriod = attr.period - 1;

        x0 = list[0];
        y0 = list[1];

        var tx = x0, ty = y0;

        for (i = 3 * lbPeriod; i < list.length; i += 3) {
            x = list[i];
            y = list[i + 1];

            //detect if the ob starts
            if (ty <= y && ty <= oby && y >= oby) {

                //find the x co-ordintate of the point of intersection
                obx = x - (((y-oby)*(x-tx))/(y-ty));

                ctx.beginPath();
                ctx.moveTo(obx, oby);

                obStart = true;
                obEnd = false;
            }
            
            //detect if the ob ends
            if (ty >= y && ty >= oby && y <= oby) {
                obx = tx + (((x-tx)*(ty-oby))/(ty-y));
                ctx.lineTo(obx, oby);

                ctx.closePath();
                ctx.fill();

                obStart = false;
                obEnd = true;
            } 

            //keep drawing the line
            if (y >= oby) {
                //if start was not detected - open start
                if (!obStart) {
                    ctx.beginPath();
                    ctx.moveTo(x0, oby);
                    ctx.lineTo(x0, y0); 

                    obStart = true;                   
                }

                ctx.lineTo(x, y);
            }
            
            tx = x, ty = y;
        }

        //if end is not detected
        if (!obEnd) {
            ctx.lineTo(x, oby);
            ctx.closePath();
            ctx.fill();
        }
    },

    /**
     * @private
     * Draws weak area and fills it with the specified style
     * @param ctx SVG or Canvas context
     * @param list list containing the transformed co-ordinates
     * @param osLevel oversold level(e.g. -20) transfromed to the ctx co-ordinates
     * @return
     *
     * TODO: This method's internal implementation is same as William %R. Re-factor it later
     */
    drawWeak: function (ctx, list, osLevel) {
        var attr = this.attr,
            i, x, y, x0, y0, osx = 0, osStart = false, osEnd = false, osy = osLevel;

        var lbPeriod = attr.period - 1;

        x0 = list[0];
        y0 = list[1];

        var tx = x0, ty = y0;

        for (i = 3 * lbPeriod; i < list.length; i += 3) {
            x = list[i];
            y = list[i + 1];

            //detect if the os starts
            if (ty >= y && ty >= osy && y <= osy) {

                //find the x co-ordintate of the point of intersection
                osx = tx + (((x-tx)*(ty-osy))/(ty-y));

                ctx.beginPath();
                ctx.moveTo(osx, osy);

                osStart = true;
                osEnd = false;
            }
            
            //detect if the os ends
            if (ty <= y && ty <= osy && y >= osy) {
                osx = x - (((y-osy)*(x-tx))/(y-ty));
                ctx.lineTo(osx, osy);

                ctx.closePath();
                ctx.fill();
                osStart = false;
                osEnd = true;
            } 

            //keep drawing the line
            if (y <= osy) {
                //if start was not detected - open start
                if (!osStart) {
                    ctx.beginPath();
                    ctx.moveTo(x, osy);
                    ctx.lineTo(x, y); 

                    osStart = true;                   
                }

                ctx.lineTo(x, y);
            }
            
            tx = x, ty = y;
        }

        //if end is not detected
        if (!osEnd) {
            // console.log('closing!!');
            ctx.lineTo(x, osy);
            ctx.closePath();
            ctx.fill();
        }
    },

    /**
     * @private Override {@link Ext.chart.series.sprite.Line#renderAggregates}
     */
    renderAggregates: function (aggregates, start, end, surface, ctx, clip, rect) {
        var me = this,
            attr = me.attr,
            dataX = attr.dataX,
            dataY = attr.dataY,
            labels = attr.labels,
            drawLabels = labels && me.getMarker('labels'),
            drawMarkers = me.getMarker('markers'),
            matrix = attr.matrix,
            surfaceMatrix = surface.matrix,
            pixel = surface.devicePixelRatio,
            xx = matrix.getXX(),
            yy = matrix.getYY(),
            dx = matrix.getDX(),
            dy = matrix.getDY(),
            markerCfg = {},
            list = this.list || (this.list = []),
            x, y, i, index,
            minXs = aggregates.minX,
            maxXs = aggregates.maxX,
            minYs = aggregates.minY,
            maxYs = aggregates.maxY,
            idx = aggregates.startIdx;

        list.length = 0;
        for (i = start; i < end; i++) {
            var minX = minXs[i],
                maxX = maxXs[i],
                minY = minYs[i],
                maxY = maxYs[i];

            if (minX < maxX) {
                list.push(minX * xx + dx, minY * yy + dy, idx[i]);
                list.push(maxX * xx + dx, maxY * yy + dy, idx[i]);
            } else if (minX > maxX) {
                list.push(maxX * xx + dx, maxY * yy + dy, idx[i]);
                list.push(minX * xx + dx, minY * yy + dy, idx[i]);
            } else {
                list.push(maxX * xx + dx, maxY * yy + dy, idx[i]);
            }
        }
        if (list.length) {
            for (i = 0; i < list.length; i += 3) {
                x = list[i];
                y = list[i + 1];
                
                index = list[i + 2];
                if (drawMarkers) {
                    me.drawMarker(x, y, index);
                }
                if (drawLabels && labels[index]) {
                    me.drawLabel(labels[index], x, y, index, rect);
                }
            }
        }
        var pixelAdjust = attr.lineWidth * surface.devicePixelRatio / 2;

        pixelAdjust -= Math.floor(pixelAdjust);

        var obLevel = Math.round(attr.strongLevel * yy + dy) - pixelAdjust;
        var osLevel = Math.round(attr.weakLevel * yy + dy) - pixelAdjust;
        var midLevel = Math.round(0 * yy + dy) - pixelAdjust;

        if (list.length) {
            var xLen = rect[2];

            //Draw strong, weak and 0 mark lines
            me.drawYLine(ctx, xLen, obLevel);
            me.drawYLine(ctx, xLen, osLevel);
            me.drawYLine(ctx, xLen, midLevel, true);

            //Draw oversold areas
            me.drawWeak(ctx, list, osLevel);

            //Draw overbaught areas
            me.drawStrong(ctx, list, obLevel);

            //draw stroke
            me.drawStroke(surface, ctx, start, end, list, rect[1] - pixel);
            ctx.stroke();
        }
    },

    /**
     * @private
     * Draws a line parallel to X-axis
     * @param ctx SVG or Canvas context
     * @param x length of the line
     * @param y ordinate where the line needs to be drawn
     * @return 
     */
    drawYLine: function(ctx, x, y, dashed) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(x, y);
        ctx.closePath();

        var linedash;
        if (dashed) {
            linedash = ctx.getLineDash();
            ctx.setLineDash([3]);
        }
        ctx.stroke();

        //reset the dash style
        if (dashed) {
            ctx.setLineDash(linedash);
        }
    }
});