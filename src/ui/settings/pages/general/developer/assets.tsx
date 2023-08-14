import { React, ReactNative as RN, i18n } from '@metro/common';
import { assets } from '@api/assets';

import { Search } from '@metro/components';
import Asset from '@ui/settings/components/asset';
import { TableRowGroupWrapper } from '@ui/components';

export default function () {
	const [search, setSearch] = React.useState<string>();

	const payload = [...assets.values()].filter(a => a.type === 'png');
	const data = search ? [] : payload;

	if (search) {
		for (const asset of payload) {
			if (
				asset.name.toLowerCase().includes(search) ||
				asset.httpServerLocation.toLowerCase().includes(search)
			) {
				data.push(asset);
			}
		}
	}

	return <RN.View>
		<Search
			placeholder={i18n.Messages.UNBOUND_SEARCH_ASSETS}
			onChangeText={search => setSearch(search)}
			onClear={() => setSearch('')}
			value={search}
		/>
        {/* The FlatList (or anything in fact) will not render with the new TableRowGroup here unless the parent is a ScrollView */}
        {/* If the parent is a ScrollView the FlatList has unexpected behavior */}
        <TableRowGroupWrapper old>
            <RN.FlatList
                keyExtractor={(_, idx) => String(idx)}
                data={data}
                initialNumToRender={20}
                renderItem={({ item, index }) => (
                    <Asset 
                        item={item} 
                        index={index} 
                        total={data.length} 
                    />
                )}
            />
        </TableRowGroupWrapper>
	</RN.View>;
}