interface WalletBalance {
	currency: string;
	amount: number;
	/* 1. missing blockchain data type */
	blockchain: string;
}
interface FormattedWalletBalance {
	currency: string;
	amount: number;
	formatted: string;
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
	const balances = useWalletBalances();
	const prices = usePrices();

	const getPriority = (blockchain: any): number => {
		switch (blockchain) {
			case 'Osmosis':
				return 100;
			case 'Ethereum':
				return 50;
			case 'Arbitrum':
				return 30;
			case 'Zilliqa':
				return 20;
			case 'Neo':
				return 20;
			default:
				return -99;
		}
	};

	const sortedBalances = useMemo(() => {
		return (
			balances
				/* 
					2. Incorrect Filtering Logic:
						- lhsPriority is undefined
						- only filter which balance.amount > 0, 
						because old logic only allows balances less than or equal to 0
				*/
				.filter(
					(balance: WalletBalance) =>
						getPriority(balance.blockchain) > -99 &&
						balance.amount > 0
				)
				/*
					3. Incorrect Sorting Logic
					- sort() function may behave unexpectedly in case leftPriority === rightPriority
					- Sort balances based on priority (higher priority first)
				*/
				.sort(
					(lhs: WalletBalance, rhs: WalletBalance) =>
						getPriority(rhs.blockchain) -
						getPriority(lhs.blockchain)
				)
		);
		/* 
			4. Remove prices from dependencies 
			- In function scopes there's no use of prices
		*/
	}, [balances]);

	/* 5. Remove formattedBalances because it is defined but no used */

	const rows = sortedBalances.map(
		(balance: FormattedWalletBalance, index: number) => {
			const usdValue = prices[balance.currency] * balance.amount;
			return (
				<WalletRow
					/* 6. Remove classes.row because classes is not defined */
					key={index}
					amount={balance.amount}
					usdValue={usdValue}
					formattedAmount={balance.formatted}
				/>
			);
		}
	);

	return <div {...rest}>{rows}</div>;
};
