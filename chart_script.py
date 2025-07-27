import json
import plotly.graph_objects as go
import plotly.express as px

# Parse the data
data = {
  "features": [
    {
      "category": "Authentication & Security",
      "features": [
        {"name": "Secure Login/Registration", "completeness": 100},
        {"name": "Multi-user Support", "completeness": 100},
        {"name": "Session Management", "completeness": 100},
        {"name": "Data Isolation", "completeness": 100},
        {"name": "Protected Routes", "completeness": 100}
      ]
    },
    {
      "category": "Personalization",
      "features": [
        {"name": "Customizable Profile", "completeness": 100},
        {"name": "Theme Preferences", "completeness": 100},
        {"name": "User-specific Dashboard", "completeness": 100},
        {"name": "Language Settings", "completeness": 100},
        {"name": "Notification Preferences", "completeness": 100}
      ]
    },
    {
      "category": "Task Management",
      "features": [
        {"name": "CRUD Operations", "completeness": 100},
        {"name": "Categories & Tags", "completeness": 100},
        {"name": "Priority Levels", "completeness": 100},
        {"name": "Due Dates", "completeness": 100},
        {"name": "Search & Filter", "completeness": 100}
      ]
    },
    {
      "category": "User Experience",
      "features": [
        {"name": "Responsive Design", "completeness": 100},
        {"name": "Dark/Light Mode", "completeness": 100},
        {"name": "Analytics Dashboard", "completeness": 100},
        {"name": "Smooth Animations", "completeness": 100},
        {"name": "Accessibility", "completeness": 95}
      ]
    }
  ]
}

# Brand colors for each category
category_colors = {
    "Authentication & Security": "#1FB8CD",
    "Personalization": "#DB4545", 
    "Task Management": "#2E8B57",
    "User Experience": "#5D878F"
}

# Abbreviate feature names to fit 15 character limit
abbreviations = {
    "Secure Login/Registration": "Secure Login",
    "Multi-user Support": "Multi-user",
    "Session Management": "Session Mgmt",
    "Data Isolation": "Data Isolation",
    "Protected Routes": "Protected Rts",
    "Customizable Profile": "Custom Profile",
    "Theme Preferences": "Theme Prefs",
    "User-specific Dashboard": "User Dashboard",
    "Language Settings": "Language",
    "Notification Preferences": "Notifications",
    "CRUD Operations": "CRUD Ops",
    "Categories & Tags": "Categories",
    "Priority Levels": "Priorities",
    "Due Dates": "Due Dates",
    "Search & Filter": "Search/Filter",
    "Responsive Design": "Responsive",
    "Dark/Light Mode": "Dark/Light",
    "Analytics Dashboard": "Analytics",
    "Smooth Animations": "Animations",
    "Accessibility": "Accessibility"
}

# Prepare data for plotting
feature_names = []
completeness_values = []
categories = []
colors = []

for category_data in data["features"]:
    category = category_data["category"]
    for feature in category_data["features"]:
        feature_names.append(abbreviations[feature["name"]])
        completeness_values.append(feature["completeness"])
        categories.append(category)
        colors.append(category_colors[category])

# Create horizontal bar chart
fig = go.Figure()

# Add bars for each category
for category in category_colors.keys():
    category_features = [name for i, name in enumerate(feature_names) if categories[i] == category]
    category_values = [val for i, val in enumerate(completeness_values) if categories[i] == category]
    
    fig.add_trace(go.Bar(
        y=category_features,
        x=category_values,
        name=category,
        orientation='h',
        marker_color=category_colors[category],
        cliponaxis=False,
        hovertemplate='<b>%{y}</b><br>Complete: %{x}%<extra></extra>'
    ))

# Update layout
fig.update_layout(
    title="Task Manager Features",
    xaxis_title="Completeness %",
    yaxis_title="Features",
    barmode='group',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Update axes
fig.update_xaxes(range=[0, 105], ticksuffix='%')
fig.update_yaxes(categoryorder='total ascending')

# Save the chart
fig.write_image("task_manager_features.png")