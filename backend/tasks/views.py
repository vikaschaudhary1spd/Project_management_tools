from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['project', 'status']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'due_date', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        # Users can ONLY access tasks for their own projects
        return Task.objects.filter(project__user=self.request.user)
