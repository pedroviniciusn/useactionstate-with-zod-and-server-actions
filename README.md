# Gerenciamento de Tarefas com Server Actions, Zod e useActionState

Este projeto demonstra como utilizar o `Next.js` para criar uma aplicação de gerenciamento de tarefas (Todos) com foco em boas práticas e tecnologias modernas. Ele aborda o uso de **server actions** para comunicação eficiente com o servidor, **useActionState** para gerenciar o estado de formulários e ações assíncronas, **zod** para validação de dados e **react-hot-toast** para feedback ao usuário. O objetivo é apresentar uma abordagem escalável e robusta para lidar com formulários, validações e interações cliente-servidor em aplicações web.

## Getting Started

Siga os passos abaixo para rodar o projeto localmente:

1. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

2. Configure as variáveis de ambiente:
   Este projeto utiliza o `json-server` para simular uma API. O arquivo `db.json` contém os dados da API. Para configurar a URL da API, crie um arquivo `.env.local` na raiz do projeto e adicione a variável `API_URL` apontando para o servidor local do `json-server`:

   ```
   API_URL=http://localhost:3001
   ```

   Para iniciar o `json-server`, execute o seguinte comando:
   ```bash
   npx json-server db.json --port 3001
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

4. Abra [http://localhost:3000](http://localhost:3000) no navegador para visualizar o projeto.

## Sobre o Componente `Todos`

O componente principal do projeto é o `Todos`, que gerencia a exibição, criação e listagem de tarefas. Ele utiliza server actions para realizar operações no servidor e retornar mensagens de erro ou sucesso ao usuário. Além disso, o `zod` é usado para validar os dados antes de enviá-los ao servidor.

### Funcionamento do `TodosForm`

O componente `TodosForm` é responsável por criar novas tarefas. Ele utiliza o hook `useActionState` para gerenciar o estado do formulário e a interação com a server action `createTodo`. 

#### Validação com `zod`

Antes de enviar os dados ao servidor, o `zod` valida os campos do formulário. Caso a validação falhe, os erros são exibidos diretamente abaixo do campo de entrada correspondente.

#### Tratamento de Erros

Se a operação no servidor falhar, o erro retornado pela server action é exibido ao usuário via `toast`. Isso garante que o usuário receba feedback imediato sobre problemas no servidor.

```tsx
const TodosForm = ({ onUpdate }: TodosFormProps) => {
  const [formState, formAction, isPending] = useActionState((_: unknown, formData: FormData) => {
    const data = Object.fromEntries(formData);

    // Validação com zod
    const validatedData = todoSchema.omit({ id: true }).safeParse(data);

    if (!validatedData.success) {
      return {
        formData,
        fieldErrors: validatedData.error.flatten().fieldErrors,
      };
    }

    // Chamada à server action
    createTodo(validatedData.data).then((data) => {
      if ("error" in data) {
        toast.error(data.error); // Exibe erro do servidor
      } else {
        onUpdate(data); // Atualiza a lista de tarefas
      }
    });
  }, {
    fieldErrors: {},
    formData: new FormData(),
  });

  return (
    <form onSubmit={formAction}>
      <div className="flex items-center gap-2">
        <input
          name="title"
          className="border-1 border-gray-300 rounded-md p-2 min-w-[250px]"
          type="text"
          placeholder="Add Todo"
          defaultValue={formState?.formData.get("title") as string || ""}
        />
        <button type="submit" className="bg-blue-500 text-white rounded-md p-2 w-1/2 cursor-pointer hover:opacity-85 transition-all ease-in duration-100" disabled={isPending}>
          Add Todo
        </button>
      </div>
      {formState?.fieldErrors?.title && <p className="text-red-500 mt-2">{formState.fieldErrors.title}</p>}
      {/* Erro de validação exibido abaixo do input */}
    </form>
  );
};
```

### Server Actions

As server actions são definidas no arquivo `src/app/actions/todos.ts`. Elas são responsáveis por realizar operações no servidor, como buscar e criar tarefas. Caso ocorra um erro, uma mensagem de erro é retornada.

```ts
export async function createTodo(data: ICreateTodo): Promise<Todo | { error: string }> {
  try {
    const url = new URL(process.env.API_URL as string);
    url.pathname = "/todos";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return { error: "Failed to create todo" }; // Retorna erro do servidor
    }

    const todo = await response.json();
    return todo;
  } catch {
    return { error: "Something went wrong" }; // Retorna erro genérico
  }
}
```

### Validação com `zod`

O esquema `todoSchema` é utilizado para validar os dados das tarefas. Ele garante que o título tenha pelo menos 3 caracteres. Caso a validação falhe, os erros são exibidos no formulário.

```ts
const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Title should be at least 3 characters long"),
});
```

### Resumo

Este projeto demonstra como combinar o hook `useActionState`, `server actions`, validação com `zod` e exibição de mensagens de erro ao usuário para criar uma aplicação robusta e amigável. A integração entre o cliente e o servidor é simplificada, enquanto a experiência do usuário é aprimorada com feedback em tempo real.
