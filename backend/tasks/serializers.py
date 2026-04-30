from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'project', 'title', 'description', 'status', 'due_date', 'created_at')
        read_only_fields = ('created_at',)

    def validate_project(self, value):
        if value.user != self.context['request'].user:
            raise serializers.ValidationError("You can only add tasks to your own projects.")
        return value
