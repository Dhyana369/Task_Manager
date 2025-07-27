import plotly.express as px

# Sample data: tasks completed per day
data = {
    "Day": ["Mon", "Tue", "Wed", "Thu", "Fri"],
    "Tasks Completed": [3, 5, 2, 4, 6]
}

# Create a bar chart
fig = px.bar(data, x="Day", y="Tasks Completed", title="Tasks Completed This Week")

# Show chart in browser
fig.show()
