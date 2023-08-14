import { Theme, StyleSheet, React, ReactNative } from "@metro/common";
import { Forms, Redesign } from "@metro/components";

export const { endStyle } = StyleSheet.createThemedStyleSheet({
    endStyle: {
        backgroundColor: Theme.colors.BACKGROUND_PRIMARY,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16
    }
})

interface TableRowGroupProps {
    children?: React.ReactNode,
    style?: any;
    old?: boolean;
    [k: PropertyKey]: any;
}

export default ({ children, style, old, ...props }: TableRowGroupProps) => {
    const overlappingStyles = [{ marginHorizontal: 16 }, style];

    if (old) {
        return <Forms.FormSection 
            sectionBodyStyle={[
                ...overlappingStyles,
                { backgroundColor: "transparent" }
            ]} 
            {...props}
        >
            {children}
        </Forms.FormSection>
    }

    return <ReactNative.View 
        style={[ 
            ...overlappingStyles, 
            { marginTop: 16 }
        ]}
    >
        <Redesign.TableRowGroup {...props}>
            {children}
        </Redesign.TableRowGroup>
    </ReactNative.View>
}