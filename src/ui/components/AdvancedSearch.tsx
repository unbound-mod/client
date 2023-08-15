import { findByName, findByProps } from '@metro';
import { noop } from '@utilities';

interface SearchContext {
    type: string;
    [key: PropertyKey]: any;
}

interface AdvancedSearchProps {
    searchContext: SearchContext;
    controls: NonNullable<unknown>;
}

const BaseSearch = findByProps('useSearchControls', { lazy: true });
const SettingSearch = findByProps('useSettingSearchQuery', { lazy: true })
const SettingSearchBar = findByName('SettingSearchBar', { interop: false, lazy: true });

export function useAdvancedSearch(searchContext: SearchContext) {
    const controls = BaseSearch.useSearchControls(searchContext, false, noop);
    const query = SettingSearch.useSettingSearchQuery();

    React.useEffect(() => {
        // Set the query back to nothing again so that it doesn't persist to the real SettingSearch
        return () => {
            SettingSearch.setSettingSearchQuery('')
            SettingSearch.setIsSettingSearchActive(false);
        }
    }, [])

    return [query, controls];
}

export function AdvancedSearch({ searchContext, controls }: AdvancedSearchProps) {
    return <BaseSearch.default 
        searchContext={searchContext}
        controls={controls}
    >
        <SettingSearchBar.default />
    </BaseSearch.default>
}

Object.assign(AdvancedSearch, { useAdvancedSearch });
export default AdvancedSearch;