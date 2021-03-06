from django.urls import path
from base.views import product_views as views

# extends url: api/products/

urlpatterns=[
    #   admin
    path('create/', views.createProduct, name='product-create'),
    path('delete/<str:pk>/', views.deleteProduct, name='product-delete'),

    path('', views.getProducts, name='products'),
    path('<str:pk>/', views.getProduct, name='product-detail'),
    path('update/<str:pk>/', views.updateProduct, name="product-update"),
]
    