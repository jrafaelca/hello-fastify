# 🚀 Despliegue de Fastify en Kubernetes (EKS)

Guía para desplegar un servicio **Fastify** en **AWS EKS** usando **Docker**, **ECR** y **Kubernetes Secrets**.

---

## 📦 Requisitos previos

- [Docker](https://docs.docker.com/get-docker/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) configurado (`aws configure`)
- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) conectado a tu cluster EKS
- [eksctl](https://eksctl.io/) (opcional, para gestionar clusters)
- Permisos en AWS para **ECR** y **EKS**

---

## 🐳 Construcción y publicación de la imagen en ECR

1. **Crear repositorio en ECR:**
   ```bash
   aws ecr create-repository --repository-name fastify
   ```

2. **Autenticarse en ECR:**
   ```bash
   aws ecr get-login-password --region us-east-1 | \
     docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
   ```

3. **Obtener el hash corto del commit actual:**
   ```bash
   GIT_COMMIT=$(git rev-parse --short HEAD)
   # Esto genera un hash corto (7 caracteres), ideal para tags Docker.
   ```

4. **Construir y etiquetar la imagen usando el hash corto:**
   ```bash
   docker build -t fastify:$GIT_COMMIT .
   docker tag fastify:$GIT_COMMIT <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/fastify:$GIT_COMMIT
   ```

5. **Subir la imagen a ECR:**
   ```bash
   docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/fastify:$GIT_COMMIT
   ```

> 💡 **Recomendación:** Usar el hash corto del commit como tag permite trazabilidad exacta y es más legible que el hash largo.

---

## 🔑 Variables de entorno y secretos

1. **Crear un archivo `.env` en la raíz del proyecto:**
   ```env
   APP_PORT=3000
   APP_HOST=0.0.0.0
   NODE_ENV=production
   DATABASE_URL=postgres://user:pass@host:5432/db
   JWT_SECRET=supersecreto
   IMAGE=<AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/fastify:$GIT_COMMIT
   ```

   ⚠️ **Nunca subas `.env` al repositorio**. Versiona solo `.env.example` sin valores sensibles.

2. **Crear un Secret en Kubernetes:**
   ```bash
   kubectl create secret generic fastify-env --from-env-file=.env
   ```

---

## 📄 Manifiestos de Kubernetes (`k8s/`)

- **deployment.yaml:** Define el despliegue y los recursos.
- **service.yaml:** Expone el servicio con LoadBalancer.
- **hpa.yaml:** Configura el autoescalado.

> Asegúrate de reemplazar `<AWS_ACCOUNT_ID>` y el tag de la imagen por el hash corto del commit correspondiente en los manifiestos.

### Ejemplo de referencia en deployment.yaml
```yaml
containers:
  - name: fastify
    image: <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/fastify:abcd123
    ports:
      - containerPort: 3000
    envFrom:
      - secretRef:
          name: fastify-env
```

---

## 🚀 Despliegue

1. **Aplicar los manifiestos:**
   ```bash
   kubectl apply -f k8s/
   ```

2. **Verificar los pods:**
   ```bash
   kubectl get pods
   ```

3. **Obtener la URL pública:**
   ```bash
   kubectl get service fastify-service
   ```

---

## 🔄 Rollback y monitoreo

- **Rollback:**
  ```bash
  kubectl rollout undo deployment fastify
  ```
- **Ver historial:**
  ```bash
  kubectl rollout history deployment fastify
  ```
- **Ver logs:**
  ```bash
  kubectl logs deployment/fastify
  ```

---

## 📌 Buenas prácticas

- Versiona solo `.env.example` (sin secretos).
- Agrega `.env` y `k8s/secret.yaml` a `.gitignore`.
- Usa el hash corto del commit como tag de la imagen para máxima trazabilidad y legibilidad.
- Configura CloudWatch, Prometheus o Grafana para logs y métricas.
- Revisa los límites de recursos y ajusta según la carga.
- Considera usar un Ingress Controller para exponer múltiples servicios.
