<?php
  include 'props.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>YUI3 Configurator</title>

  <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Maven+Pro:400,700">
  <link rel="stylesheet" href="<?php echo YUI_BASE_PATH; ?>/cssgrids/grids-min.css">
  <link rel="stylesheet" href="./config.css">

  <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">

  <script src="<?php echo YUI_BASE_PATH; ?>/yui/yui-min.js"></script>
</head>
<body class="yui3-skin-sam">

<div id="doc">

  <div id="bd" class="clearfix yui3-g">

    <div class="project-version yui3-u"><?php echo YUI_VERSION; ?></div>

    <div class="yui3-u-1">
      <div class="body-heading">
        <h1>YUI3 Configurator</h1>
      </div>
    </div>

    <div class="yui3-u print-max-width">
      <div class="content">
        <p class="instructions">
          Select the modules you'd like to use on your page, from the list below.
          The corresponding includes for your page will be displayed below, or
          you can download the combined files by clicking the buttons on the
          <b>Get Files</b> section.
        </p>
        <p class="instructions">
          Several YUI modules support the <b>night</b> skin in addition to the <b>sam</b>
          skin, try <code>autocomplete-list, datatable-base, dial, overlay, panel,
          scrollview-base, scrollview-list, scrollview-scrollbars, slider-base,
          tabview</code> and <code>widget-buttons</code>. The <code>slider-base</code>
          actually supports 9 skins!
        </p>
        <div id="configurator">
          <div id="configTab">
            <!-- 2 Column Grid -->
            <div class="yui3-g">
              <div class="yui3-u-3-4">
                <div id="configOpts" class="shadow-box top-row">
                    <div class="hd"><h5>Options</h5></div>
                    <div class="bd">
                      <label> File Type:
                        <select id="filter">
                          <option value="min" selected> Min </option>
                          <option value="raw"> Raw </option>
                          <option value="debug"> Debug </option>
                        </select>
                      </label><br/>
                      <label> Skins Order (e.g. <span class="pre">night,sam</span>):
                        <input id="skin_order" type="text">
                      </label>
                      <label> Skin Overrides (e.g. <span class="pre">overlay:night; panel:night</span>):
                        <input id="skin_override" type="text">
                      </label>
                    </div>
                </div>
              </div>
              <div class="yui3-u-1-4">
                <div id="configBtns" class="shadow-box top-row">
                  <div class="hd"><h5>Get Files</h5></div>
                  <div class="bd">
                    <a id="get_js" href="javascript:void(0);" target="_blank" class="btn disabled-button">Javascript (.js)</a>
                    <br/><br/>
                    <a id="get_css" href="javascript:void(0);" target="_blank" class="btn disabled-button">StyleSheet (.css)</a>
                  </div>
                </div>
              </div>
            </div>
            <!-- 3 Column Grid -->
            <div id="modInfo" class="yui3-g">
              <div class="yui3-u-1-3">
                <div id="allModules" class="shadow-box modulesList col-full">
                  <div class="hd"><h5>All Modules <span>(Click to add)</span></h5></div>
                  <div class="bd"></div>
                </div>
              </div>
              <div class="yui3-u-1-3">
                <div id="selectedModules" class="shadow-box modulesList col-half">
                  <div class="hd"><h5>Selected Modules <span>(Click to remove)</span></h5></div>
                  <div class="bd"></div>
                </div>
                <div id="calculatedModules" class="shadow-box col-half">
                  <div class="hd"><h5>Calculated Modules</h5></div>
                  <div class="bd"></div>
                </div>
              </div>
              <div class="yui3-u-1-3">
                <div id="results" class="shadow-box col-full">
                  <div class="hd"><h5>Combo URLs</h5></div>
                  <div class="bd"><textarea class="HTML" cols="50" rows="6" id="loaderOutput" name="loaderOutput"><!--Copy/paste from here--></textarea></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
    </div>
  </div>

  <div id="ft"><footer>
      <p class="copyright">
      </p>
  </footer></div>

</div>

<script src="./config.js"></script>

</body>
</html>
