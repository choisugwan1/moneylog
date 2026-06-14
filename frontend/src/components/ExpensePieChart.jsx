import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ExpensePieChart({ expenseCategoryData }) {
  return (
    <section className="panel">
      <h2 className="panel-title">카테고리별 지출 비중</h2>

      {expenseCategoryData.length === 0 ? (
        <p className="empty-text">지출 데이터가 없습니다.</p>
      ) : (
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseCategoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {expenseCategoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      [
                        "#ef4444",
                        "#f97316",
                        "#eab308",
                        "#22c55e",
                        "#3b82f6",
                        "#8b5cf6",
                      ][index % 6]
                    }
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => `${Number(value).toLocaleString()}원`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default ExpensePieChart;