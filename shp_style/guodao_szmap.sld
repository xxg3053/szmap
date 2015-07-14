<?xml version="1.0" encoding="gb2312"?>
<sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" version="1.0.0">
    <sld:UserLayer>
        <sld:LayerFeatureConstraints>
            <sld:FeatureTypeConstraint/>
        </sld:LayerFeatureConstraints>
        <sld:UserStyle>
            <sld:Name>guodao</sld:Name>
            <sld:FeatureTypeStyle>
                <sld:Name>group 0</sld:Name>
                <sld:FeatureTypeName>Feature</sld:FeatureTypeName>
                <sld:SemanticTypeIdentifier>generic:geometry</sld:SemanticTypeIdentifier>
                <sld:SemanticTypeIdentifier>simple</sld:SemanticTypeIdentifier>
                <sld:Rule>
                    <sld:Name>yd</sld:Name>
                    <ogc:Filter>
                        <ogc:PropertyIsLike wildCard="*" singleChar="?" escape="\">
                            <ogc:PropertyName>ROADCODE</ogc:PropertyName>
                            <ogc:Literal>Y*</ogc:Literal>
                        </ogc:PropertyIsLike>
                    </ogc:Filter>
                    <sld:LineSymbolizer>
                        <sld:Stroke>
                            <sld:CssParameter name="stroke">#400000</sld:CssParameter>
                        </sld:Stroke>
                    </sld:LineSymbolizer>
                </sld:Rule>
                <sld:Rule>
                    <sld:Name>xd</sld:Name>
                    <ogc:Filter>
                        <ogc:PropertyIsLike wildCard="*" singleChar="?" escape="\">
                            <ogc:PropertyName>ROADCODE</ogc:PropertyName>
                            <ogc:Literal>X*</ogc:Literal>
                        </ogc:PropertyIsLike>
                    </ogc:Filter>
                    <sld:LineSymbolizer>
                        <sld:Stroke>
                            <sld:CssParameter name="stroke-width">2.0</sld:CssParameter>
                        </sld:Stroke>
                    </sld:LineSymbolizer>
                   
                </sld:Rule>
                <sld:Rule>
                    <sld:Name>sd</sld:Name>
                    <ogc:Filter>
                        <ogc:PropertyIsLike wildCard="*" singleChar="?" escape="\">
                            <ogc:PropertyName>ROADCODE</ogc:PropertyName>
                            <ogc:Literal>S*</ogc:Literal>
                        </ogc:PropertyIsLike>
                    </ogc:Filter>
                    <sld:LineSymbolizer>
                        <sld:Stroke>
                            <sld:CssParameter name="stroke">#008040</sld:CssParameter>
                            <sld:CssParameter name="stroke-width">2.0</sld:CssParameter>
                        </sld:Stroke>
                    </sld:LineSymbolizer>
                    
                </sld:Rule>
                <sld:Rule>
                    <sld:Name>gd</sld:Name>
                    <ogc:Filter>
                        <ogc:PropertyIsLike wildCard="*" singleChar="?" escape="\">
                            <ogc:PropertyName>ROADCODE</ogc:PropertyName>
                            <ogc:Literal>G*</ogc:Literal>
                        </ogc:PropertyIsLike>
                    </ogc:Filter>
                    <sld:LineSymbolizer>
                        <sld:Stroke>
                            <sld:CssParameter name="stroke">#FF0000</sld:CssParameter>
                            <sld:CssParameter name="stroke-width">2.0</sld:CssParameter>
                        </sld:Stroke>
                    </sld:LineSymbolizer>
                   
                </sld:Rule>
            </sld:FeatureTypeStyle>
        </sld:UserStyle>
    </sld:UserLayer>
</sld:StyledLayerDescriptor>