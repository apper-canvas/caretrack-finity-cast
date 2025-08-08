import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format, subDays, subMonths, subWeeks } from "date-fns";
import Chart from "react-apexcharts";
import healthMetricService from "@/services/api/healthMetricService";
import ApperIcon from "@/components/ApperIcon";
import MetricCard from "@/components/molecules/MetricCard";
import MetricModal from "@/components/organisms/MetricModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";

const HealthMetrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMetric, setEditingMetric] = useState(null);
  const [selectedMetricType, setSelectedMetricType] = useState("all");
  const [chartTimeRange, setChartTimeRange] = useState("week");

  const metricTypes = [
    { value: "all", label: "All Metrics", icon: "Activity" },
    { value: "blood_pressure", label: "Blood Pressure", icon: "Heart" },
    { value: "glucose", label: "Blood Glucose", icon: "Droplet" },
    { value: "weight", label: "Weight", icon: "Scale" },
    { value: "temperature", label: "Temperature", icon: "Thermometer" },
    { value: "heart_rate", label: "Heart Rate", icon: "Activity" }
  ];

  const loadMetrics = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await healthMetricService.getAll();
      setMetrics(data);
    } catch (err) {
      setError("Failed to load health metrics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (editingMetric) {
        await healthMetricService.update(editingMetric.Id, formData);
        toast.success("Health metric updated successfully!");
      } else {
        await healthMetricService.create(formData);
        toast.success("Health metric recorded successfully!");
      }
      
      setShowModal(false);
      setEditingMetric(null);
      loadMetrics();
    } catch (error) {
      toast.error("Failed to save health metric. Please try again.");
    }
  };

  const handleEdit = (metric) => {
    setEditingMetric(metric);
    setShowModal(true);
  };

  const handleDelete = async (metricId) => {
    if (!window.confirm("Are you sure you want to delete this health metric?")) {
      return;
    }

    try {
      await healthMetricService.delete(metricId);
      toast.success("Health metric deleted successfully!");
      loadMetrics();
    } catch (error) {
      toast.error("Failed to delete health metric. Please try again.");
    }
  };

const getFilteredMetrics = () => {
    if (selectedMetricType === "all") return metrics;
    return metrics.filter(metric => (metric.type_c || metric.type) === selectedMetricType);
  };

const getChartData = (metricType) => {
    const typeMetrics = metrics
      .filter(metric => (metric.type_c || metric.type) === metricType)
      .sort((a, b) => new Date(a.date_c || a.date) - new Date(b.date_c || b.date));
    let dateRange;
    switch (chartTimeRange) {
      case "week":
        dateRange = subWeeks(new Date(), 1);
        break;
      case "month":
        dateRange = subMonths(new Date(), 1);
        break;
      case "3months":
        dateRange = subMonths(new Date(), 3);
        break;
      default:
        dateRange = subWeeks(new Date(), 1);
}

    const filteredMetrics = typeMetrics.filter(metric => new Date(metric.date_c || metric.date) >= dateRange);

    return {
      series: [{
name: metricType.replace("_", " "),
        data: filteredMetrics.map(metric => ({
          x: new Date(metric.date_c || metric.date).getTime(),
          y: parseFloat(metric.value_c || metric.value)
        }))
      }],
      options: {
        chart: {
          type: "line",
          height: 300,
          toolbar: { show: false },
          background: "transparent"
        },
        stroke: {
          curve: "smooth",
          width: 3
        },
        colors: ["#2563eb"],
        grid: {
          borderColor: "#e2e8f0",
          strokeDashArray: 3
        },
        xaxis: {
          type: "datetime",
          labels: {
            style: { colors: "#64748b" }
          }
        },
        yaxis: {
          labels: {
            style: { colors: "#64748b" }
          }
        },
        tooltip: {
          x: {
            format: "MMM dd, yyyy"
          }
        }
      }
    };
  };

const getMetricStats = () => {
    const stats = {};
    metricTypes.slice(1).forEach(type => {
      const typeMetrics = metrics.filter(metric => (metric.type_c || metric.type) === type.value);
      const recentMetrics = typeMetrics
        .sort((a, b) => new Date(b.date_c || b.date) - new Date(a.date_c || a.date))
        .slice(0, 7);
      
      if (recentMetrics.length > 0) {
        const latest = recentMetrics[0];
        const latestValue = latest.value_c || latest.value;
        const latestUnit = latest.unit_c || latest.unit;
        const average = recentMetrics.reduce((sum, metric) => sum + parseFloat(metric.value_c || metric.value), 0) / recentMetrics.length;
        
        stats[type.value] = {
          latest: latestValue + " " + latestUnit,
          average: average.toFixed(1) + " " + latestUnit,
          count: typeMetrics.length,
          trend: recentMetrics.length > 1 ? 
            (parseFloat(latestValue) > parseFloat(recentMetrics[1].value_c || recentMetrics[1].value) ? "up" : "down") : null
        };
      }
    });
    return stats;
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadMetrics} />;

  const filteredMetrics = getFilteredMetrics().sort((a, b) => new Date(b.date) - new Date(a.date));
  const stats = getMetricStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-surface-900">Health Metrics</h1>
          <p className="text-surface-600 mt-1">Track and monitor your vital health measurements</p>
        </div>
        
        <Button 
          onClick={() => {
            setEditingMetric(null);
            setShowModal(true);
          }}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={20} />
          <span>Record Metric</span>
        </Button>
      </div>

      {/* Quick Stats */}
      {Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(stats).slice(0, 4).map(([type, data]) => {
            const metricType = metricTypes.find(t => t.value === type);
            return (
              <Card key={type} className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg">
                    <ApperIcon name={metricType?.icon || "Activity"} size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-surface-600 font-medium">{metricType?.label}</p>
                    <p className="text-lg font-bold text-surface-900">{data.latest}</p>
                    <p className="text-xs text-surface-500">Avg: {data.average}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Charts Section */}
      {metrics.length > 0 && (
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold font-display text-surface-900">Trends</h2>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={chartTimeRange === "week" ? "primary" : "outline"}
                size="small"
                onClick={() => setChartTimeRange("week")}
              >
                Week
              </Button>
              <Button
                variant={chartTimeRange === "month" ? "primary" : "outline"}
                size="small"
                onClick={() => setChartTimeRange("month")}
              >
                Month
              </Button>
              <Button
                variant={chartTimeRange === "3months" ? "primary" : "outline"}
                size="small"
                onClick={() => setChartTimeRange("3months")}
              >
                3 Months
              </Button>
            </div>
          </div>

{selectedMetricType !== "all" && metrics.filter(m => (m.type_c || m.type) === selectedMetricType).length > 0 ? (
            <Chart {...getChartData(selectedMetricType)} />
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="TrendingUp" size={48} className="text-surface-300 mx-auto mb-4" />
              <p className="text-surface-600">Select a specific metric type to view trends</p>
            </div>
          )}
        </Card>
      )}

      {/* Type Filter */}
<div className="flex flex-wrap gap-2">
        {metricTypes.map((type) => (
          <Button
            key={type.value}
            variant={selectedMetricType === type.value ? "primary" : "outline"}
            size="small"
            onClick={() => setSelectedMetricType(type.value)}
            className="flex items-center space-x-2"
          >
            <ApperIcon name={type.icon} size={16} />
            <span>{type.label}</span>
            {type.value !== "all" && (
              <span className="text-xs opacity-75">
                ({metrics.filter(m => (m.type_c || m.type) === type.value).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Metrics List */}
      {filteredMetrics.length === 0 ? (
        <Empty
          title="No health metrics found"
          message="Start recording your health metrics to track your wellness journey"
          icon="Activity"
          actionLabel="Record Metric"
          onAction={() => {
            setEditingMetric(null);
            setShowModal(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMetrics.map((metric) => (
            <MetricCard
              key={metric.Id}
              metric={metric}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Metric Modal */}
      <MetricModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingMetric(null);
        }}
        onSubmit={handleSubmit}
        metric={editingMetric}
      />
    </div>
  );
};

export default HealthMetrics;