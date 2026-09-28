const StatisticCard = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="flex flex-col items-center justify-between rounded-xl bg-zinc-800 p-3 md:flex-row md:p-4">
      <span className="mb-2 text-sm text-zinc-400 md:mb-0 md:text-base">
        {label}
      </span>
      <span className="text-sm font-semibold text-white md:text-base">
        {value}
      </span>
    </div>
  );
};

export default StatisticCard;
