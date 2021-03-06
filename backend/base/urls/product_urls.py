from django.urls import path
from base.views import product_views as views

# extends url: api/products/

urlpatterns=[

    path('', views.getProducts, name='products'),
    path('<str:pk>/', views.getProduct, name='product-detail'),

    path('delete/<str:pk>/', views.deleteProduct, name='product-delete'),
]
    